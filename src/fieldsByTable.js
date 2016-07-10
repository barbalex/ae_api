'use strict'

module.exports = {
  category: [
    'name',
  ],
  object: [
    'id',
    'category',
    'organization_id',
  ],
  property_collection: [
    'id',
    'name',
    'description',
    'links',
    'combining',
    'last_updated',
    'organization_id',
    'terms_of_use',
    'imported_by',
  ],
  property_collection_object: [
    'object_id',
    'property_collection_id',
    'properties',
  ],
  relation: [
    'id',
    'object_id',
    'relation_collection_id',
    'properties',
  ],
  relation_collection: [
    'id',
    'name',
    'description',
    'links',
    'nature_of_relation',
    'combining',
    'last_updated',
    'organization_id',
    'terms_of_use',
    'imported_by',
  ],
  relation_collection_object: [
    'object_id',
    'relation_collection_id',
  ],
  relation_partner: [
    'object_id',
    'relation_id',
  ],
  taxonomy: [
    'id',
    'name',
    'description',
    'links',
    'last_updated',
    'organization_id',
    'category',
    'is_category_standard',
  ],
  taxonomy_object: [
    'id',
    'taxonomy_id',
    'parent_id',
    'object_id',
    'name',
    'properties',
  ]
}
