import strings from "@lang/Lang"
import { Editor } from "@tiptap/react"
import TipTapMenuButton from "./TipTapMenuButton"

export interface TipTapMenuProps {
  editor: Editor | null
}

const TipTapMenu: React.FC<TipTapMenuProps> = ({
  editor,
}) => {
  if (!editor) {
    return null
  }

  const selectValues = [
    {
      name: strings.paragraph, symbol: "P",
      active: editor.isActive('paragraph'),
      onClick: () => editor.chain().focus().setParagraph().run(),
    }, {
      name: strings.heading_1, symbol: "H1",
      active: editor.isActive('heading', { level: 1 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    }, {
      name: strings.heading_2, symbol: "H2",
      active: editor.isActive('heading', { level: 2 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    }, {
      name: strings.heading_3, symbol: "H3",
      active: editor.isActive('heading', { level: 3 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
  ]

  return (
    <div className="flex flex-wrap gap-2 items-center border-b dark:border-gray-700 p-1">
      <select
        className="
        form-select border-lightPurple rounded-[4px] h-8 py-0 bg-white dark:bg-dimGray focus:border-primary dark:focus:border-primaryLight focus:ring-1 placeholder:text-mediumGray dark:placeholder:text-gray-600
        dark:border-gray-700
        "
        onChange={(val) => selectValues[parseInt(`${val.currentTarget.value}`)]?.onClick()}
        value={selectValues.findIndex(v => v.active).toString()}
      >
        {selectValues.map((v, index) => {
          return <option key={index} value={index}>{v.name}</option>
        })}
      </select>
      <div className="flex flex-wrap gap-2 items-center">
        <TipTapMenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
        >
          <p className="font-bold">B</p>
        </TipTapMenuButton>
        <TipTapMenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
        >
          <svg
            viewBox="0 0 24 24"
            width="1em"
            stroke="currentColor"
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            height="1em"
          >
            <line x1={19} y1={4} x2={10} y2={4} />
            <line x1={14} y1={20} x2={5} y2={20} />
            <line x1={15} y1={4} x2={9} y2={20} />
          </svg>
        </TipTapMenuButton>
        <TipTapMenuButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
        >
          <p className="underline">U</p>
        </TipTapMenuButton>
        <TipTapMenuButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'is-active' : ''}
        >
          <p className="line-through">&nbsp;S&nbsp;</p>
        </TipTapMenuButton>
      </div>
      <span className="h-6 border-r dark:border-gray-700" />
      <div className="flex flex-wrap gap-2 items-center">
        <TipTapMenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            focusable="false"
          >
            <path
              fill="currentColor"
              d="M11 5h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 010-2zm0 6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 010-2zm0 6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 010-2zM4.5 6c0-.4.1-.8.4-1 .3-.4.7-.5 1.1-.5.4 0 .8.1 1 .4.4.3.5.7.5 1.1 0 .4-.1.8-.4 1-.3.4-.7.5-1.1.5-.4 0-.8-.1-1-.4-.4-.3-.5-.7-.5-1.1zm0 6c0-.4.1-.8.4-1 .3-.4.7-.5 1.1-.5.4 0 .8.1 1 .4.4.3.5.7.5 1.1 0 .4-.1.8-.4 1-.3.4-.7.5-1.1.5-.4 0-.8-.1-1-.4-.4-.3-.5-.7-.5-1.1zm0 6c0-.4.1-.8.4-1 .3-.4.7-.5 1.1-.5.4 0 .8.1 1 .4.4.3.5.7.5 1.1 0 .4-.1.8-.4 1-.3.4-.7.5-1.1.5-.4 0-.8-.1-1-.4-.4-.3-.5-.7-.5-1.1z"
              fillRule="evenodd"
            />
          </svg>
        </TipTapMenuButton>
        <TipTapMenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            focusable="false"
          >
            <path
              fill="currentColor"
              d="M10 17h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 010-2zm0-6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 010-2zm0-6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 110-2zM6 4v3.5c0 .3-.2.5-.5.5a.5.5 0 01-.5-.5V5h-.5a.5.5 0 010-1H6zm-1 8.8l.2.2h1.3c.3 0 .5.2.5.5s-.2.5-.5.5H4.9a1 1 0 01-.9-1V13c0-.4.3-.8.6-1l1.2-.4.2-.3a.2.2 0 00-.2-.2H4.5a.5.5 0 01-.5-.5c0-.3.2-.5.5-.5h1.6c.5 0 .9.4.9 1v.1c0 .4-.3.8-.6 1l-1.2.4-.2.3zM7 17v2c0 .6-.4 1-1 1H4.5a.5.5 0 010-1h1.2c.2 0 .3-.1.3-.3 0-.2-.1-.3-.3-.3H4.4a.4.4 0 110-.8h1.3c.2 0 .3-.1.3-.3 0-.2-.1-.3-.3-.3H4.5a.5.5 0 110-1H6c.6 0 1 .4 1 1z"
              fillRule="evenodd"
            />
          </svg>
        </TipTapMenuButton>
      </div>
      <span className="h-6 border-r dark:border-gray-700" />
      <div className="flex flex-wrap gap-2 items-center">
        <TipTapMenuButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        >
          <svg height="1.12rem" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>

        </TipTapMenuButton>
        <TipTapMenuButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          <svg height="1.12rem" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
          </svg>
        </TipTapMenuButton>
      </div>
    </div>
  )
}

export default TipTapMenu;