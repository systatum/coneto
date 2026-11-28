import { css } from "styled-components"
import { RichEditor, RichEditorMode } from "./../../components/rich-editor"

describe("RichEditor layout", () => {
  it("keeps the editor content below the toolbar", () => {
    cy.mount(
      <div style={{ width: 640 }}>
        <RichEditor
          mode={RichEditorMode.MarkdownEditor}
          value="First line"
          height={140}
          styles={{
            toolbarStyle: css`
              padding-top: 8px;
              padding-bottom: 8px;
            `,
          }}
          formatting={{
            allowBold: true,
            allowItalic: true,
            allowUnderline: true,
            allowOrderedList: true,
            allowUnorderedList: true,
            allowCheckBoxes: true,
          }}
        />
      </div>,
    )

    cy.findByLabelText("toolbar-content").then(($toolbar) => {
      const toolbar = $toolbar[0].getBoundingClientRect()

      cy.findByLabelText("rich-editor-content").then(($editor) => {
        const editor = $editor[0].getBoundingClientRect()

        expect(editor.top).to.be.gte(toolbar.bottom)
      })
    })
  })
})
