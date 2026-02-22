import StackObj, { Stack } from "./sdk";
import { addEditableTags } from "@contentstack/utils";

export const getHomePageRes = async (
  locale = null
) => {
  const response: any = (await StackObj.getEntry({
    contentTypeUid: "home_page",
    referenceFieldPath: [
      "page_sections.featured_products.products",
      "page_sections.collection_highlight.products"
    ],
    jsonRtePath: [
      "page_sections.image_text.description",
      "page_sections.collection_highlight.description"
    ],
    locale,
  }));
  
  if (response && response.length > 0) {
    const entries = Array.isArray(response[0]) ? response[0] : response;
    
    if (entries && entries.length > 0) {
      const entry = entries[0];
      addEditableTags(entry, "home_page", true, locale || "en-us");
      return entry;
    }
  }
  
  return null;
};

export const getAboutPageRes = async (
  locale = null
) => {
  const response: any = (await StackObj.getEntry({
    contentTypeUid: "about_page",
    referenceFieldPath: [],
    jsonRtePath: [
      "page_components.widget.description"
    ],
    locale,
  }));
  
  if (response && response.length > 0) {
    const entries = Array.isArray(response[0]) ? response[0] : response;
    
    if (entries && entries.length > 0) {
      const entry = entries[0];
      addEditableTags(entry, "about_page", true, locale || "en-us");
      return entry;
    }
  }
  
  return null;
};

export const getHeaderRes = async (locale = null) => {
  try {
    const response: any = await StackObj.getEntryByUid({
      contentTypeUid: "header_v2",
      entryUid: "bltdf9b155a6ba1861b",
      referenceFieldPath: [],
      jsonRtePath: [],
      locale,
    });

    if (response) {
      addEditableTags(response, "header_v2", true, locale || "en-us");
      return response;
    }
  } catch (error) {
    console.error("Error fetching universal Header v2:", error);
  }
  
  return null;
};

export const getProductRes = async (url: string, locale = null) => {
  try {
    const response: any = await Stack.ContentType('product')
      .Query()
      .where('url', url)
      .language(locale || 'en-us')
      .toJSON()
      .find();
      
    if (response && response.length > 0) {
      const entries = Array.isArray(response[0]) ? response[0] : response;
      const entry = entries?.[0];
      
      if (entry) {
        addEditableTags(entry, "product", true, locale || "en-us");
        return entry;
      }
    }
  } catch (error) {
    console.error("Error fetching individual product by slug:", error);
  }
  
  return null;
};

export const getFooterRes = async (locale = null) => {
  try {
    const response: any = await StackObj.getEntryByUid({
      contentTypeUid: "footer_v2",
      entryUid: "bltda90f941da9b637c",
      referenceFieldPath: [],
      jsonRtePath: [],
      locale,
    });

    if (response) {
      addEditableTags(response, "footer_v2", true, locale || "en-us");
      return response;
    }
  } catch (error) {
    console.error("Error fetching universal Footer v2:", error);
  }
  
  return null;
};

export const getCollectionsRes = async (locale = null) => {
  try {
    const response: any = await StackObj.getEntryByUid({
      contentTypeUid: "collections",
      entryUid: "blt7de23544cd2404d7",
      referenceFieldPath: ["reference"],
      jsonRtePath: [],
      locale,
    });

    if (response) {
      addEditableTags(response, "collections", true, locale || "en-us");
      return response;
    }
  } catch (error) {
    console.error("Error fetching Collections layout:", error);
  }
  
  return null;
};

export const getCategoryRes = async (url: string, locale = null) => {
  try {
    const response: any = await Stack.ContentType('category')
      .Query()
      .where('url', url)
      .language(locale || 'en-us')
      .toJSON()
      .find();
      
    if (response && response.length > 0) {
      const entries = Array.isArray(response[0]) ? response[0] : response;
      const entry = entries?.[0];
      
      if (entry) {
        addEditableTags(entry, "category", true, locale || "en-us");
        return entry;
      }
    }
  } catch (error) {
    console.error("Error fetching category by url:", error);
  }
  
  return null;
};

export const getProductsByCategory = async (categoryUid: string, locale = null) => {
  try {
    const productQuery = Stack.ContentType("product").Query();
    
    productQuery
      .where("category.uid", categoryUid)
      .language(locale || 'en-us')
      .includeReference("category");

    const response: any = await productQuery.toJSON().find();
    
    if (response && response.length > 0) {
      const entries = Array.isArray(response[0]) ? response[0] : response;
      if (entries && entries.length > 0) {
        entries.forEach((entry: any) => {
           addEditableTags(entry, "product", true, locale || "en-us");
        });
        return entries;
      }
    }
  } catch (error) {
    console.error("Error fetching products by category UID:", error);
  }
  
  return [];
};
