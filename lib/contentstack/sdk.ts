import contentstack, { Stack as StackType } from "contentstack";
import * as Utils from "@contentstack/utils";
import ContentstackLivePreview from "@contentstack/live-preview-utils";

export const config = {
  API_KEY: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY as string,
  DELIVERY_TOKEN: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN as string,
  PREVIEW_TOKEN: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_TOKEN as string,
  ENVIRONMENT: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT as string,
  API_HOST: process.env.NEXT_PUBLIC_CONTENTSTACK_API_HOST as string,
  APP_HOST: process.env.NEXT_PUBLIC_CONTENTSTACK_APP_HOST as string,
  BRANCH: process.env.NEXT_PUBLIC_CONTENTSTACK_BRANCH || "main",
};

const getPreviewHost = () => {
  return (config.API_HOST || "")
    .replace("cdn", "rest-preview")
    .replace(".io", ".com");
};

export type LivePreviewQueryParams = {
  live_preview?: string;
  content_type_uid?: string;
  entry_uid?: string;
  preview_timestamp?: string;
  release_id?: string;
  [key: string]: string | undefined;
};

/**
 * Creates a new Stack instance for each request.
 * Required for SSR to avoid cross-request contamination with live preview.
 */
export function createStack(): StackType {
  const previewHost = getPreviewHost();
  
  const stack = contentstack.Stack({
    api_key: config.API_KEY,
    delivery_token: config.DELIVERY_TOKEN,
    environment: config.ENVIRONMENT,
    branch: config.BRANCH,
    live_preview: {
      preview_token: config.PREVIEW_TOKEN || "",
      enable: true,
      host: previewHost || "",
    },
  });

  if (config.API_HOST) {
    stack.setHost(config.API_HOST);
  }

  return stack;
}

/**
 * Shared Stack instance for client-side operations and backward compatibility.
 * For SSR with live preview, use createStack() instead.
 */
export const Stack = createStack();

/**
 * Sets up the stack for live preview by passing URL search params.
 * Call this in server components before fetching data.
 */
export function setLivePreviewQuery(
  stack: StackType,
  searchParams: LivePreviewQueryParams | null | undefined
): void {
  if (searchParams && searchParams.live_preview) {
    stack.livePreviewQuery(searchParams as Parameters<StackType['livePreviewQuery']>[0]);
  }
}

/**
 * Initialize live preview for client-side.
 * Must be called in a client component.
 */
export const initLivePreview = () => {
  if (typeof window !== "undefined") {
    const appURL = new URL(config.APP_HOST || "https://app.contentstack.com");

    ContentstackLivePreview.init({
      enable: true,
      mode: "builder",
      stackSdk: Stack,
      ssr: true,
      editButton: {
        enable: true,
      },
      stackDetails: {
        apiKey: config.API_KEY,
        environment: config.ENVIRONMENT,
        branch: config.BRANCH,
      },
      clientUrlParams: {
        protocol: appURL.protocol.replace(":", "") as "http" | "https",
        host: appURL.hostname,
        port: appURL.port ? parseInt(appURL.port, 10) : 443,
      },
    });
  }
};

const renderOption = {
  span: (node: any, next: any) => {
    return next(node.children);
  },
};

export const onEntryChange = ContentstackLivePreview.onEntryChange;

interface GetEntryParams {
  contentTypeUid: string;
  referenceFieldPath?: string[];
  jsonRtePath?: string[];
  locale?: string | null;
}

interface GetEntryByUrlParams extends GetEntryParams {
  entryUrl: string;
  includeAll?: boolean;
}

interface GetEntryByUidParams extends GetEntryParams {
  entryUid: string;
}

/**
 * Creates SDK helper functions bound to a specific Stack instance.
 * Use this for SSR with live preview support.
 */
export function createStackHelpers(stack: StackType) {
  return {
    getEntry({
      contentTypeUid,
      referenceFieldPath,
      jsonRtePath,
      locale,
    }: GetEntryParams) {
      return new Promise((resolve, reject) => {
        const query = stack.ContentType(contentTypeUid).Query();
        if (referenceFieldPath) query.includeReference(referenceFieldPath);
        if (locale) query.language(locale);
        query
          .includeFallback()
          .toJSON()
          .find()
          .then(
            (result: any) => {
              jsonRtePath &&
                Utils.jsonToHTML({
                  entry: result,
                  paths: jsonRtePath,
                  renderOption,
                });
              resolve(result);
            },
            (error) => {
              reject(error);
            }
          );
      });
    },

    getEntryByUrl({
      contentTypeUid,
      entryUrl,
      referenceFieldPath,
      jsonRtePath,
      locale,
      includeAll = false,
    }: GetEntryByUrlParams) {
      return new Promise((resolve, reject) => {
        const query = stack.ContentType(contentTypeUid).Query();
        if (referenceFieldPath) query.includeReference(referenceFieldPath);
        if (locale) query.language(locale);
        if (includeAll) {
          query.addQuery("include_all", "true");
          query.addQuery("include_all_depth", "2");
        }
        query
          .addQuery("include_applied_variants", "true")
          .includeFallback()
          .toJSON();
        const data = query.where("url", `${entryUrl}`).find();
        data.then(
          (result: any) => {
            jsonRtePath &&
              Utils.jsonToHTML({
                entry: result,
                paths: jsonRtePath,
                renderOption,
              });
            resolve(result[0] || null);
          },
          (error) => {
            reject(error);
          }
        );
      });
    },

    getEntryByUid({
      contentTypeUid,
      entryUid,
      referenceFieldPath,
      jsonRtePath,
      locale,
    }: GetEntryByUidParams) {
      return new Promise((resolve, reject) => {
        const query = stack.ContentType(contentTypeUid).Entry(entryUid);
        if (referenceFieldPath) query.includeReference(referenceFieldPath);
        if (locale) query.language(locale);

        query.includeFallback().toJSON();

        query.fetch().then(
          (result: any) => {
            jsonRtePath &&
              Utils.jsonToHTML({
                entry: result,
                paths: jsonRtePath,
                renderOption,
              });
            resolve(result);
          },
          (error) => {
            reject(error);
          }
        );
      });
    },
  };
}

/**
 * Default export for backward compatibility with client-side usage.
 * Uses the shared Stack instance.
 */
export default createStackHelpers(Stack);
