import { Editor } from '@tinymce/tinymce-react';
import { FC, memo, useEffect, useMemo, useRef, useState } from 'react';

// import 'tinymce/plugins/paste';
// import 'tinymce/plugins/hr';

import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/skins/ui/oxide/content.min.css';
import 'tinymce/skins/content/default/content.min.css';

import strings from '../../lang/Lang';
import TinyError from '../Error/TinyError';
import useDebounce from '../../hooks/useDebounce';
import { SectionLoading } from '@partials/Loadings/SectionLoading';
import Card from '@components/card';
import Label from "../../components/form/Label";

export interface NoteEditorJsProps {
  data?: string,
  error?: boolean,
  helperText?: string,
  onChange?: (data: string) => void,
  label?: string
}

const NoteEditorJs: FC<NoteEditorJsProps> = ({
  data = "",
  error,
  helperText = '',
  label,
  onChange = () => { }
}) => {

  const debounceValue = useDebounce(data, 200);
  const newData = useMemo(() => debounceValue, [debounceValue]);
  const [value, setValue] = useState(data ?? '');
  const editorRef = useRef(null);
  const [loaded, setLoaded] = useState(false)

  async function loadTinyMCE() {
    await import('tinymce/tinymce')
    // @ts-ignore
    await import('tinymce/icons/default')
    // @ts-ignore
    await import('tinymce/plugins/lists')
    // @ts-ignore
    await import('tinymce/plugins/table')
    // @ts-ignore
    await import('tinymce/themes/silver')
    setLoaded(true);
    onChange(value ?? '');
  }

  useEffect(() => {
    if (loaded) return;
    loadTinyMCE()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onChange(value ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {

    setValue((value) => {
      if (newData === value) {
        return value;
      }

      return newData;
    })
  }, [newData, setValue]);

  const ua = navigator.userAgent.toLowerCase()
  var isAndroidMobile = useMemo(() => ua.indexOf("android") > -1, [ua]);

  // To Change 
  const headings = useMemo(() => {
    return `${strings.paragraph}=p;${strings.heading_1}=h1;${strings.heading_2}=h2;${strings.heading_3}=h3`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strings.getLanguage()]);

  if (!loaded) {
    return (
      <Card>
        <SectionLoading />
      </Card>
    )
  }

  return (
    <div >
      <Label label={label} />
      <div className="prose-sm" key={'note-editor-div'}>
        <Editor
          // @ts-ignore
          onInit={(evt, editor) => editorRef.current = editor}
          key={'note-editor-self'}
          initialValue={''}
          value={value}
          init={{
            skin: false,
            content_css: false,
            content_style: `
            @import url("https://rsms.me/inter/inter.css"); 
            body{ font-family: "Inter var", sans-serif; }; 
            body {
              min-height: 400px;
            }
          `,
            height: 500,
            menubar: false,
            statusbar: false,
            plugins: ['lists',],
            // plugins: ['table', 'lists', 'hr'],
            toolbar: 'formatselect | bold italic underline strikethrough | bullist numlist | hr | undo redo',
            block_formats: headings,
            mobile: {
              toolbar_mode: 'wrap',
            },
            setup: (editor) => {
              if (!isAndroidMobile) return;
              editor.on('keydown', function (e) {
                var newstr = editor.getContent()
                if (newstr.includes('p>')) {
                  var newstring = newstr.replace("p>", 'div>');
                  editor.setContent(newstring)
                  editor.selection.select(editor.getBody(), true);
                  editor.selection.collapse(false);
                }
              });
            }
          }}
          onEditorChange={(content, editor) => {
            setValue(content)
          }}
        />
        <TinyError error={error} helperText={helperText} />
      </div>
    </div>
  );
}

export default memo(NoteEditorJs);