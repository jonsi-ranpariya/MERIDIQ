import Card from '@components/card'
import { SectionLoading } from '@partials/Loadings/SectionLoading'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useRef } from 'react'
import TipTapMenu from './TipTapMenu'

export interface TipTapEditorProps {
  data?: string,
  error?: boolean,
  loading?: boolean
  helperText?: string,
  onChange?: (data: string) => void,
  label?: string
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({
  data = "",
  error,
  helperText = '',
  label,
  loading = false,
  onChange = () => {}
}) => {

  const dataRef = useRef(data)

  //write debounce function 
  let timeOutId: any = undefined;
  const handleChange = (html: string) => {
    if (timeOutId) { clearTimeout(timeOutId) }
    timeOutId = setTimeout(() => { onChange(html) }, 500)
  }

  const editor = useEditor({
    extensions: [StarterKit, Underline,],
    content: dataRef.current,
    onUpdate: ({ editor }) => {
      handleChange(editor.getHTML())
    }
  })

  useEffect(() => {
    if (editor && !editor.isDestroyed && data !== editor?.getHTML()) {
      editor.commands.setContent(data)
    }
  }, [data, editor])

  const loaded = !!editor;

  if (!loaded || loading) {
    return (
      <Card>
        <SectionLoading />
      </Card>
    )
  }

  return (
    <div className='
    bg-white dark:bg-dimGray border rounded-md focus-within:ring-1 focus-within:ring-primary focus-within:border-primary
    dark:border-gray-700 dark:focus-within:border-primaryLight
    '>
      <TipTapMenu editor={editor} key={"tiptap_menu"} />
      <EditorContent
        key={"tiptap_editor"}
        editor={editor}
        className={`
          prose dark:prose-invert
          rounded-b-md
          max-w-full
        `}
      />
    </div>
  );
}

export default TipTapEditor;