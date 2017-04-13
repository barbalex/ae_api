SELECT
  name AS eigenschaften_sammlung,
  json_data.key AS feld,
  json_data.value AS wert,
  count(json_data.value) AS anzahl_vorkommen
FROM
  ae.property_collection
  INNER JOIN ae.property_collection_object
  ON id = property_collection_id,
  jsonb_each_text(property_collection_object.properties) AS json_data
GROUP BY
  name,
  feld,
  wert
ORDER BY
  name,
  feld,
  wert;

SELECT
  name AS beziehungs_sammlung,
  json_data.key AS feld,
  json_data.value AS wert,
  count(json_data.value) AS anzahl_vorkommen
FROM
  ae.relation
  INNER JOIN ae.relation_collection
  ON relation_collection.id = relation.relation_collection_id,
  jsonb_each_text(relation.properties) AS json_data
GROUP BY
  name,
  feld,
  wert
ORDER BY
  name,
  feld,
  wert;
