import { useEffect } from 'react'
import { RichTextEditor } from '@mantine/tiptap'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import { useEditor } from '@tiptap/react'

type DemoRichTextEditorProps = {
  replayClassName: string
}

export function DemoRichTextEditor({ replayClassName }: DemoRichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false,
        underline: false,
      }),
      Underline,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Type something...' }),
    ],
    editorProps: {
      attributes: {
        class: replayClassName,
      },
    },
  })

  useEffect(() => {
    editor?.setOptions({
      editorProps: {
        attributes: {
          class: replayClassName,
        },
      },
    })
  }, [editor, replayClassName])

  return (
    <RichTextEditor editor={editor} className="demo-editor">
      <RichTextEditor.Toolbar sticky={false}>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  )
}
