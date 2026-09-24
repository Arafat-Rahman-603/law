# MongoDB Atlas Search Configuration

This document specifies the exact MongoDB Atlas Search index definitions required for `SEARCH_PROVIDER=atlas` to function.
Search indexes must be created through the MongoDB Atlas UI, Atlas CLI, or MongoDB Node Driver Search Index API. They cannot be created using standard `createIndex()` methods.

## 1. Global Law Search Index
**Collection:** `laws`
**Index Name:** `default` (or specify name in `AtlasSearchProvider`)

### Definition (JSON)
```json
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "title": {
        "type": "string",
        "analyzer": "lucene.standard",
        "multi": {
          "autocomplete": {
            "type": "autocomplete",
            "analyzer": "lucene.standard",
            "tokenization": "edgeGram",
            "minGrams": 2,
            "maxGrams": 15
          }
        }
      },
      "summary": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "jurisdiction": {
        "type": "objectId"
      },
      "country": {
        "type": "objectId"
      },
      "verificationStatus": {
        "type": "string"
      },
      "isDemo": {
        "type": "boolean"
      },
      "slug": {
        "type": "string"
      }
    }
  }
}
```

## 2. RAG Source Search Index (Vector + Hybrid fallback)
If vector search is enabled for the `LawSections` or `LegalProcedures` collection.

**Collection:** `lawsections`
**Index Name:** `vector_index`

### Definition (JSON)
```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 768,
      "similarity": "cosine"
    },
    {
      "type": "filter",
      "path": "jurisdiction"
    },
    {
      "type": "filter",
      "path": "lawId"
    }
  ]
}
```

## Maintenance Pipeline
When laws are verified or archived, their `verificationStatus` is updated via Mongoose. Atlas Search automatically syncs changes to indexed fields in near real-time (usually milliseconds). No manual database repair is required.
