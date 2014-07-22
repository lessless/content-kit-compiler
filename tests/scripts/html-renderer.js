module('html-renderer');

var compiler = new ContentKit.Compiler();

test('render', function() {
  var input = '<p>This is <i>italic</i>, this is <b>bold</b>, this is <i><b>both styles</b></i></p>';
  var parsed = compiler.parse(input);
  var rendered = compiler.render(parsed);

  equal ( rendered, input );
});

test('render with nested markup tags', function() {
  var input = '<p><i>Nested test <b>end</b></i>. <i><b>Nested</b> test start</i>. <i>Nested <b>test</b> middle</i>. <i><b>Nested test whole</b></i></p>';
  var parsed = compiler.parse(input);
  var rendered = compiler.render(parsed);

  equal ( rendered, input );
});

test('render with wrapped unsupported markup tags', function() {
  var input = '<p><span>Nested test <b>end</b></span>. <span><b>Nested</b> test start</span>. <span>Nested <b>test</b> middle</span>. <span><b>Nested test whole</b></span></p>';
  var correctOutput = '<p>Nested test <b>end</b>. <b>Nested</b> test start. Nested <b>test</b> middle. <b>Nested test whole</b></p>';
  var parsed = compiler.parse(input);
  var rendered = compiler.render(parsed);

  equal ( rendered, correctOutput );
});

test('render with nested unsupported markup tags', function() {
  var input = '<p><b>Nested test <span>end</span></b>. <b><span>Nested</span> test start</b>. <b>Nested <span>test</span> middle</b>. <b><span>Nested test whole</span></b></p>';
  var correctOutput = '<p><b>Nested test end</b>. <b>Nested test start</b>. <b>Nested test middle</b>. <b>Nested test whole</b></p>';
  var parsed = compiler.parse(input);
  var rendered = compiler.render(parsed);

  equal ( rendered, correctOutput );
});

test('render with attributes', function() {
  var input = '<p class="test"><a href="http://google.com/" rel="publisher">Link</a></p>';
  var parsed = compiler.parse(input);
  var rendered = compiler.render(parsed);

  // some browsers (firefox) change order of attributes so can't just do direct compare
  // equal ( rendered, input );

  var div = document.createElement('div');
  div.innerHTML = rendered;
  var nodes = div.childNodes;

  equal( nodes[0].className, 'test' );
  equal( nodes[0].firstChild.attributes.href.value, 'http://google.com/' );
  equal( nodes[0].firstChild.attributes.rel.value, 'publisher' );
});

test('render elements', function() {
  var input = '<h2>The Title</h2><h3>The Subtitle</h3><p>Paragraph <b>1</b></p><p>Paragraph <i><b>2</b></i></p><p>Paragraph with a <a href="http://google.com/">link</a>.</p><blockquote>Quote</blockquote>';
  var parsed = compiler.parse(input);
  var rendered = compiler.render(parsed);
  
  equal ( rendered, input );
});

test('render self-closing elements', function() {
  var input = '<img src="http://domain.com/test1.png"/><img src="http://domain.com/test2.png"/>';
  var parsed = compiler.parse(input);
  var rendered = compiler.render(parsed);

  equal ( rendered, input );
});

test('registering custom type renderers', function() {
  var compiler = new ContentKit.Compiler();
  compiler.renderer.willRenderType(15, function(data) {
    return '<cite>' + data.value + '</cite>';
  });

  var html = compiler.render([
    {
      type: 15,
      value: 'test text'
    }
  ]);

  equal ( html, '<cite>test text</cite>' );
});

test('creating custom type renderers from constructor', function() {
  var renderer = new ContentKit.HTMLRenderer({
    typeRenderers: {
      15: function(data) {
        return '<cite>' + data.value + '</cite>';
      }
    }
  });

  var compiler = new ContentKit.Compiler({
    renderer: renderer
  });

  var html = compiler.render([
    {
      type: 15,
      value: 'test text'
    }
  ]);

  equal ( html, '<cite>test text</cite>' );
});
