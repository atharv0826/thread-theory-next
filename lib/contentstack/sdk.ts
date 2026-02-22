import contentstack from "contentstack";
import * as Utils from "@contentstack/utils";
import ContentstackLivePreview from "@contentstack/live-preview-utils";

const config = {
  API_KEY: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY as string,
  DELIVERY_TOKEN: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN as string,
  PREVIEW_TOKEN: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_TOKEN as string,
  ENVIRONMENT: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT as string,
  API_HOST: process.env.NEXT_PUBLIC_CONTENTSTACK_API_HOST as string,
  APP_HOST: process.env.NEXT_PUBLIC_CONTENTSTACK_APP_HOST as string,
};

const previewApiUrl = (config.API_HOST || "")
  .replace("cdn", "rest-preview")
  .replace(".io", ".com");

export const Stack = contentstack.Stack({
  api_key: config.API_KEY,
  delivery_token: config.DELIVERY_TOKEN,
  environment: config.ENVIRONMENT,
  branch: process.env.NEXT_PUBLIC_CONTENTSTACK_BRANCH || "main",
  live_preview: {
    preview_token: config.PREVIEW_TOKEN ? config.PREVIEW_TOKEN : "",
    enable: true,
    host: previewApiUrl ? previewApiUrl : "",
  },
});

/**
 * initialize live preview
 */

// Handle SSR context gracefully where window/document might not exist
export const initLivePreview = () => {
    if (typeof window !== "undefined") {
        const appURL = new URL(config.APP_HOST || "http://localhost:3000");

        ContentstackLivePreview.init({
          enable: true,
          mode: "builder",
          stackSdk: Stack,
          clientUrlParams: {
            host: appURL.hostname,
            port: appURL.port,
            protocol: appURL.protocol.split(":")[0] as "http" | "https",
          },
          stackDetails: {
            apiKey: config.API_KEY,
          },
          ssr: false, // For local client
        });
    }
};

if (config.API_HOST) {
  Stack.setHost(config.API_HOST);
}

const renderOption = {
  span: (node: any, next: any) => {
    return next(node.children);
  },
};

export const onEntryChange = ContentstackLivePreview.onEntryChange;

export default {
  /**
   *
   * fetches all the entries from specific content-type
   * @param contentTypeUid
   * @param referenceFieldPath
   * @param jsonRtePath
   *
   */
  getEntry({
    contentTypeUid,
    referenceFieldPath,
    jsonRtePath,
    locale,
  }: any) {
    return new Promise((resolve, reject) => {
      const query = Stack.ContentType(contentTypeUid).Query();
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
          },
        );
    });
  },

  /**
   *fetches specific entry from a content-type by url
   */
  getEntryByUrl({
    contentTypeUid,
    entryUrl,
    referenceFieldPath,
    jsonRtePath,
    locale,
    includeAll = false,
  }: any) {
    return new Promise((resolve, reject) => {
      const query = Stack.ContentType(contentTypeUid).Query();
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
        },
      );
    });
  },

  /**
   *fetches specific entry from a content-type by UID
   */
  getEntryByUid({
    contentTypeUid,
    entryUid,
    referenceFieldPath,
    jsonRtePath,
    locale,
  }: any) {
    return new Promise((resolve, reject) => {
      const query = Stack.ContentType(contentTypeUid).Entry(entryUid);
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
