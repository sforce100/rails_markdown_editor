//= require highlight.pack
//= require markdown-it
//= require markdown-it-footnote
//= require rawdeflate
//= require rawinflate
//= require codemirror
//= require codemirror/keymaps/sublime


(function($){
    $.fn.foxmarkdown = function(options){
        var defaults = {
          mode: 'gfm',
          lineNumbers: true,
          matchBrackets: true,
          lineWrapping: true,
          theme: 'base16-light',
          outID: 'out'
        }

        var opts = $.extend(defaults, options)
        var self = this;
        var editor, md, hashto;
        this.edit = function () {
            md = markdownit({
              highlight: function(code, lang){
                if(lang && hljs.getLanguage(lang)){
                  try {
                    return hljs.highlight(lang, code).value;
                  }catch(e){}
                }
                return '';
              }
            }).use(markdownitFootnote);



            editor = CodeMirror.fromTextArea(document.getElementById(self.attr('id')), opts);

            editor.on('change', update);

            document.addEventListener('drop', function(e){
              e.preventDefault();
              e.stopPropagation();

              var theFile = e.dataTransfer.files[0];
              var theReader = new FileReader();
              theReader.onload = function(e){
                editor.setValue(e.target.result);
              };

              theReader.readAsText(theFile);
            }, false);

            if(window.location.hash){
              var h = window.location.hash.replace(/^#/, '');
              if(h.slice(0,5) == 'view:'){
                setOutput(decodeURIComponent(escape(RawDeflate.inflate(atob(h.slice(5))))));
                document.body.className = 'view';
              }else{
                editor.setValue(
                  decodeURIComponent(escape(
                    RawDeflate.inflate(
                      atob(
                        h
                      )
                    )
                  ))
                );
                update(editor);
                editor.focus();
              }
            }else{
              update(editor);
              editor.focus();
            }
            return editor;
        }

        this.show = function (content) {
          md = markdownit({
            highlight: function(code, lang){
              if(lang && hljs.getLanguage(lang)){
                try {
                  return hljs.highlight(lang, code).value;
                }catch(e){}
              }
              return '';
            }
          }).use(markdownitFootnote);
          setOutput(content);
        }
       
        function updateHash(){
          window.location.hash = btoa( // base64 so url-safe
            RawDeflate.deflate( // gzip
              unescape(encodeURIComponent( // convert to utf8
                editor.getValue()
              ))
            )
          );
        }

        function update(e){
          setOutput(e.getValue());

          clearTimeout(hashto);
          hashto = setTimeout(updateHash, 1000);
        }

        function setOutput(val){
          val = val.replace(/<equation>((.*?\n)*?.*?)<\/equation>/ig, function(a, b){
            return '<img src="http://latex.codecogs.com/png.latex?' + encodeURIComponent(b) + '" />';
          });

          var out = document.getElementById(opts.outID);
          var old = out.cloneNode(true);
          out.innerHTML = md.render(val);

          var allold = old.getElementsByTagName("*");
          if (allold === undefined) {
            return;
          }
          var allnew = out.getElementsByTagName("*");
          if (allnew === undefined) {
            return;
          }
          for (var i = 0, max = Math.min(allold.length, allnew.length); i < max; i++) {
            if (!allold[i].isEqualNode(allnew[i])) {
              out.scrollTop = allnew[i].offsetTop;
              return;
            }
          }
        }

        // return this.edit();
        return this;
    };

})(jQuery) ;