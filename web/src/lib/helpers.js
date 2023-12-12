import React from 'react';
import config from '../config/config.client';
import {getDataTypeText} from '../client/datasets/tags/store';

/**
 * Returns a capitalized string
 * @return string
 */
export function capitalize(string: string) {
  return string
    ? string.charAt(0).toUpperCase() + string.slice(1)
    : null;
}

/**
 * Rounds a float to specified precision(number of digits after the decimal point).
 * @return number
 */
export function round(number: number, precision: number = 0) {
  return Math.round((number + Math.pow(10, -precision - 2)) * Math.pow(10, precision)) / Math.pow(10, precision);
}

/**
 * Returns formatted number
 * @return string
 */
export function getLocaleString(number: number, separator: string = ',') {
  let parts = number.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return parts.join('.');
}

/**
 * @param size number Size in MB
 * @return string
 */
export function getSizeWithUnit(size: number) {
  let unit = 'MB';

  if (size >= 1000) {
    size /= 1000;
    unit = 'GB';
  } else if (size < 1) {
    size *= 1000;
    unit = 'KB';
  }

  return getLocaleString(round(size, 1)) + ' ' + unit;
}

/**
 * Returns path to the image.
 * @param image_filename as given in information.schema|null
 * @param database_name as given in information.schema|null
 * @return string|null
 */
export function getImagePath(image, schema) {
  if (!image && schema) {
    const imagePath = config.images.datasetsGeneratedPath + schema + '.svg';
    return checkImage(imagePath, schema) ? imagePath : null;
  }
  return image ? config.images.datasetsPath + image : null;
}

/**
 * Returns true if image with passed src exists (both client and server side).
 * @return boolean
 */
export function checkImage(src: string, schema: string) {
  if (process.env.IS_BROWSER) {
    var req = new XMLHttpRequest();
    req.open('HEAD', src, false);
    try {
      req.send(null);
      return req.status === 200;
    } catch (e) {
      return false;
    }
  } else {
    const fs = require('fs');
    const path = require('path');
    if (fs.existsSync(path.join(__dirname, '..', '..', src))) {
      return true;
    } else {
      const sqlViz = require('../services/sqlviz/sqlviz.js');
      sqlViz.getSchema(schema);
      return false;
    }
  }
}

export function getTagName(name) {
  name = getDataTypeText(name);
  return getNameWithTooltip(name);
}

export const tooltips = {
  'LOB': 'Large Objects like images or long texts',
  'Temporal': 'Date, time or timestamp',
  'Spatial': 'Geometric types like point, line or polygon',
  'Size': 'Size of all the tables and indexes in the database',
  'Count of rows': 'Count of tuples in the whole dataset',
  'Count of columns': 'Count of all attributes (including IDs and target(s)) in the whole dataset',
  'Loops': 'Does the relational diagram contain cycles?',
  'Instance count': 'Count of rows in the target table',
  'Target table': 'The single table, where target column, target ID and target timestamp reside',
  'Target column': 'The \'label\' column to predict',
  'Target ID': 'The unit for which to make the predictions (e.g. customer)',
  'Target timestamp': 'To which time to make the prediction',
  'With loops': 'The relational diagram contains cycles',
  'Without loops': 'Like in star or snowflake schema',
  'Compound keys': 'Compound key consists of two or more attributes that uniquely identify an entity occurrence',
  'With compound keys': 'With a key that consists of two or more attributes that uniquely identify an entity occurrence',
  'Without compound keys': 'All keys are simple keys',
  'Real': 'Data consist of real-world measurements',
  'Synthetic': 'Data are a product of a simulation',
  'Associated task': 'Task associated with the target column',
  '#Relations': 'Count of tables in the dataset',
  '#Attributes': 'Count of all columns in the dataset',
  '#Tuples': 'Count of all rows in the dataset',
  '#Instances': 'Count of rows in the target table'
};

export function getNameWithTooltip(name, capitalizeName = true) {
  if (capitalizeName) name = capitalize(name);
  if (tooltips[name])
    return <abbr title={tooltips[name]}>{name}</abbr>;
  return name;
}
