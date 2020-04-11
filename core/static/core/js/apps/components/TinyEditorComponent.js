import React, {Component} from 'react';
import tinymce from 'tinymce';
import 'tinymce/themes/modern';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/table';
import 'tinymce/plugins/code';
import 'tinymce/plugins/image';
import 'tinymce/plugins/imagetools';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/link';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/textcolor';
import 'tinymce/plugins/media';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/autoresize';


export default class TinyEditorComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editor: null,
            value: this.props.value,
        };
    }

    componentDidMount() {
        tinymce.init({
            selector: `#${this.props.id}`,
            content_style: 'blockquote {color:darkgrey;border-left:5px solid #eee;padding: 0 20px;margin: 10px 0 10px;} ' +
                '.mce-content-body {font-size:14px;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;} p {margin: auto}',
            branding: false,
            elementpath: false,
            statusbar: false,
            theme: 'modern',
            plugins: 'table code lists emoticons image link preview textcolor media imagetools paste autoresize',
            toolbar: 'emoticons | bold italic blockquote removeformat | forecolor backcolor | code | bullist numlist table | styleselect | link uploadimage media | outdent indent ',
            menubar: false,
            paste_data_images: true,
            paste_retain_style_properties: 'font-size font-style',
            autoresize_min_height: 100,
            autoresize_max_height: 400,
            default_link_target:'_blank',
            relative_urls : false,
            remove_script_host : false,
            convert_urls : true,
            browser_spellcheck: true,
            formats: {
                removeformat: [
                    {
                        selector: '*',
                        attributes: ['style', 'class'],
                        remove: 'all',
                        split: true,
                        expand: false,
                        deep: true
                    }
                ]
            },
            setup: editor => {
                this.setState({editor});
                editor.on('keyup change', () => {
                    const content = editor.getContent();
                    this.onChangeValue(content);
                });
                editor.on('keydown', (e) => {
                   if (e.keyCode == 13) {
                       if (this.splitBlockquote()) {
                           return false;
                       }
                   }
                });
                editor.on('keydown', function (event) {
                    if (event.keyCode == 9) { // tab pressed
                        if (event.shiftKey) {
                            editor.execCommand('Outdent');
                        } else {
                            editor.execCommand('Indent');
                        }

                        event.preventDefault();
                        return false;
                    }
                });
                editor.on('init', () => {
                    if (this.props.auto_focus !== false) {
                        editor.focus();
                    }
                    editor.selection.select(editor.getBody(), true);
                    editor.selection.collapse(false);

                });
                editor.addButton('uploadimage', {
                    text: '',
                    icon: 'image',
                    onclick: this.uploadImage,
                });
            },
        })
    }

    componentWillUnmount() {
        tinymce.remove(this.state.editor);
    }

    onChangeValue(value) {
        const {onChange} = this.props;
        const {editor} = this.state;

        if (value.match(/\([+?-]\)/)) {
            // запоминаем текущее положение курсора
            editor.selection.setContent('<span id="temp-span"/>');

            // приходится заново получать содержимое, т.к. мы его только что поменяли
            value = editor.getContent();

            value = value.replace('(+)', ' <img src="https://gkit.ru/static/task_manager/img/add.png">&nbsp;');
            value = value.replace('(-)', ' <img src="https://gkit.ru/static/task_manager/img/forbidden.png">&nbsp;');
            value = value.replace('(?)', ' <img src="https://gkit.ru/static/task_manager/img/help_16.png">&nbsp;');
            if (this.state.editor) {
                editor.setContent(value);

                // восстанавливаем положение курсора
                var newNode = editor.dom.select('span#temp-span');
                editor.selection.select(newNode[0]);
                editor.selection.setContent('');
            }
            // еще раз получаем содержание, т.к. убрали метку для курсора
            value = editor.getContent();
        }
        this.setState({value});
        if (onChange) {
            onChange(value)
        }
    }

    uploadImage() {
        var editor = tinymce.activeEditor;

        var fileInput = document.createElement('input');
        fileInput.setAttribute('type', 'file');
        fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
        fileInput.setAttribute('multiple', '');
        fileInput.addEventListener('change', () => {

            if (fileInput.files != null) {

                var i;
                for (i = 0; i < fileInput.files.length; i++) {
                    var file = fileInput.files[i];
                    let reader = new FileReader();
                    reader.onload = (e) => {
                        editor.insertContent('<img src="' + e.target.result + '">');
                        fileInput.value = '';
                    };
                    reader.readAsDataURL(file);
                }
            }
        });
        fileInput.click();
        editor.focus();
    }

    splitBlockquote() {
        var ed = tinymce.activeEditor;
        var parts, i, node, bq_node, openTags, closeTags, splitToken;

        // get the top-most blockquote parent node
        function getMostTopBlockquote(n, r) {
            var last_bq = null;
            while (n) {
                if (n == r)
                    break;
                if (n.nodeName === 'BLOCKQUOTE')
                    last_bq = n;
                n = n.parentNode;
            }
            return last_bq;
        }


        function getClose(n, r) {
            // get the htnk "close-tag" of a node
            function getCloseTag(n) {
                if (n.nodeName === 'FONT' && ed.settings.convert_fonts_to_spans) {
                    return '</span>';
                } else {
                    return '</' + n.nodeName.toLowerCase() + '>';
                }
            }

            var result = '';
            while (n) {
                if (n == r)
                    break;
                result += getCloseTag(n);
                n = n.parentNode;
            }
            return result;
        }

        function getOpen(n, r) {
            // get the html "open-tag" of a node
            function getOpenTag(n) {
                var attr, copy;
                copy = n.cloneNode(false);
                copy.innerHTML = '';
                attr = ed.dom.getOuterHTML(copy)
                    .replace(new RegExp('<' + copy.nodeName, 'i'), '')
                    .replace(new RegExp('</' + copy.nodeName + '>', 'i'), '');
                return '<' + copy.nodeName.toLowerCase() + attr;
            }

            var result = '';
            while (n) {
                if (n == r)
                    break;
                result = getOpenTag(n) + result;
                n = n.parentNode;
            }
            return result;
        }

        node = ed.selection.getNode();
        bq_node = getMostTopBlockquote(node, ed.getBody());
        if (!bq_node) // we aren't in a blockquote
            return false;

        /* Create an unique splitToken */
        splitToken = '_$' + (new Date()).getTime() + '$_';
        ed.selection.setContent(splitToken, {format: 'raw'});
        parts = ed.getContent().split(splitToken);
        var starting_spaces_re = /^(<br\s*\/?>|\s*|\\uC2A0|&nbsp;)*/; // \uC2A0 это неразрывный пробел в Unicode,
        // который не отлавливается \s регекса.
        // Подробнее https://stackoverflow.com/questions/2774471/what-is-c2-a0-in-mime-encoded-quoted-printable-text
        parts[1] = parts[1].replace(starting_spaces_re, '');

        /* blockquote can handle DOM tree. So we have to close
         * and open DOM element correctly, and not wildly split
         * the editor content. Plus, openTags has to keep all
         * attributes to keep makeup of DOM elements, we split.
         */
        openTags = getOpen(node, bq_node);
        closeTags = getClose(node, bq_node);

        if (ed.settings.convert_fonts_to_spans && openTags != '') {
            /* juste convert </span> to </font>
             * if <font> are converted to <span>
             * as n.nodeName returns "FONT" for <span> node :/
             * @see tinymce.Editor.-_convertFonts() for more information
             */
            (function () {
                var font_count = (openTags.match(/<font/ig) || []).length;
                for (i = 0; i < font_count; ++i) {
                    var start_idx = parts[1].indexOf('</span>');
                    if (start_idx != -1) {
                        parts[1] = parts[1].substring(0, start_idx)
                            + '</font>'
                            + parts[1].substring(start_idx + 7);
                    }
                }
            })();
        }

        /* Update the editor content :
         *  - part[0] : content before the selection, before split
         *  - closeTags : </tag> to close correctly html tags
         *  - </blockquote> : close the blockquote
         *  - <br id='__' /> : The id
         *                     is used to change the location of the selection (cursor)
         *  - <blockquote> : open the new blockquote
         *  - openTags : re-open splited DOM nodes correctly
         *  - part[1] : content after the selection, before split
         */
        ed.setContent(parts[0] + closeTags
            + '</blockquote><br id=\'__\'><blockquote>'
            + openTags + parts[1]);

        /* delete empty <p>aragraphe at the end of the first blockquote
         * and at the beginnig at the second blockquote.
         * Delete id attributes to */
        function clean_node(node) {
            var node_html;
            if (node == null || node.nodeName != 'P') {
                return;
            }
            node_html = node.innerHTML.trim();
            if (node_html == '' || node_html == '<br mce_bogus="1">' || node_html == '<br>') {
                ed.dom.remove(node);
            }
        }

        bq_node = ed.getBody().getElementsByTagName('blockquote');
        for (i = 0; i < bq_node.length; ++i) {
            if (bq_node[i] == null) {
                continue;
            }
            /* paranoiac mode */
            clean_node(bq_node[i].firstChild);
            clean_node(bq_node[i].lastChild);
            if (bq_node[i].innerHTML.trim() === '') {
                ed.dom.remove(bq_node[i]);
            }
        }

        /* get the <br id="__"> element and put cursor on it */
        node = ed.dom.get('__');
        node.removeAttribute('id');
        ed.selection.select(node);
        ed.selection.collapse(true);

        return true;
    }

    render() {
        const {value} = this.state;
        const {name, className} = this.props;

        return <div>
            <input type='hidden' name={name} defaultValue={value}/>
            <textarea
                id={this.props.id}
                value={value}
                onChange={this.onChangeValue.bind(this)}
                className={className}
                name={this.props.name}
            />
        </div>
    }
}