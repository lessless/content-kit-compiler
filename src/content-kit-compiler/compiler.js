import HTMLParser from './parsers/html-parser';
import HTMLRenderer from './renderers/html-renderer';
import Type from './types/type';
import { DefaultBlockTypeSet, DefaultMarkupTypeSet } from './types/default-types';
import { mergeWithOptions } from '../content-kit-utils/object-utils';

/**
 * @class Compiler
 * @constructor
 * @param options
 */
function Compiler(options) {
  var parser = new HTMLParser();
  var renderer = new HTMLRenderer();
  var defaults = {
    parser           : parser,
    renderer         : renderer,
    blockTypes       : DefaultBlockTypeSet,
    markupTypes      : DefaultMarkupTypeSet,
    includeTypeNames : false // true will output type_name: 'TEXT' etc. when parsing for easier debugging
  };
  mergeWithOptions(this, defaults, options);

  // Reference the compiler settings
  parser.blockTypes  = renderer.blockTypes  = this.blockTypes;
  parser.markupTypes = renderer.markupTypes = this.markupTypes;
  parser.includeTypeNames = this.includeTypeNames;
}

/**
 * @method parse
 * @param input
 * @return Object
 */
Compiler.prototype.parse = function(input) {
  return this.parser.parse(input);
};

/**
 * @method render
 * @param data
 * @return Object
 */
Compiler.prototype.render = function(data) {
  return this.renderer.render(data);
};

/**
 * @method registerBlockType
 * @param {Type} type
 */
Compiler.prototype.registerBlockType = function(type) {
  if (type instanceof Type) {
    return this.blockTypes.addType(type);
  }
};

/**
 * @method registerMarkupType
 * @param {Type} type
 */
Compiler.prototype.registerMarkupType = function(type) {
  if (type instanceof Type) {
    return this.markupTypes.addType(type);
  }
};

export default Compiler;
