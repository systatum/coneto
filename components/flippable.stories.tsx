import { Meta, StoryObj } from "@storybook/react/*";
import { Flippable, FlippableRef } from "./flippable";
import { Button } from "./button";
import { useRef } from "react";
import styled, { css } from "styled-components";

const meta: Meta<typeof Flippable> = {
  title: "Stage/Flippable",
  component: Flippable,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
**Flippable** is an interactive container component that displays front and back content with a smooth 3D flip animation. It supports imperative controls, customizable dimensions, animation duration, and fully customizable styles for both faces.

---

### ✨ Features

* 🔄 **3D flip animation**: Smooth card flip transition between front and back content.
* 🎛 **Imperative controls**: Programmatically control flipping using \`flip\`, \`unFlip\`, and \`toggle\` methods via refs.
* ⏱ **Customizable animation duration**: Adjust flip speed using the \`flipDuration\` prop (in second).
* 🎨 **Customizable styles**: Override container, front face, and back face styles using styled-components \`CSSProp\`.
* 📏 **Flexible sizing**: Configure width and height using numbers or CSS values.
* 🧩 **Flexible content**: Render any ReactNode on the front and back faces.
* 🎭 **Theme support**: Supports separate theme styling for front and back faces.

---

### 📌 Usage

\`\`\`tsx
<Flippable
  width={280}
  height={180}
  flipDuration={0.6}
  back={
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Back Side
    </div>
  }
>
  <div
    style={{
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    Front Side
  </div>
</Flippable>
\`\`\`

* Click the component to toggle between front and back faces.
* Use \`flipDuration\` to control the transition speed.
* Use \`width\` and \`height\` to define the component size.
* Customize appearance through \`styles.self\`, \`styles.frontStyle\`, and \`styles.backStyle\`.
* Access \`flip\`, \`unFlip\`, and \`toggle\` methods through a component ref for programmatic control.
* Render any ReactNode on either side to create cards, flashcards, product previews, profile cards, or interactive content.
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Flippable>;

export const Default: Story = {
  render: () => {
    const ref = useRef<FlippableRef>(null);

    const FrontLabel = styled.p`
      margin: 0 0 4px;
      font-size: 11px;
      opacity: 0.6;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    `;

    const FrontName = styled.h3`
      margin: 0;
      font-size: 22px;
      font-weight: 600;
    `;

    const FrontRole = styled.p`
      margin: 4px 0 0;
      font-size: 13px;
      opacity: 0.8;
    `;

    const FrontHint = styled.p`
      margin: 0;
      font-size: 12px;
      opacity: 0.6;
    `;

    const BackTitle = styled.p`
      margin: 0 0 12px;
      font-size: 11px;
      opacity: 0.6;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    `;

    const LinkList = styled.div`
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;

    const ContactLink = styled.a`
      font-size: 13px;
      color: #fff;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 8px;
      opacity: 0.9;

      &:hover {
        opacity: 1;
        text-decoration: underline;
      }
    `;

    const BackHint = styled.p`
      margin: 0;
      font-size: 12px;
      opacity: 0.6;
    `;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <Flippable
          width={260}
          ref={ref}
          back={
            <>
              <div>
                <BackTitle>Contact</BackTitle>
                <LinkList>
                  <ContactLink
                    onClick={(e) => e.stopPropagation()}
                    href="mailto:adam@systatum.com"
                  >
                    📧 adam@systatum.com
                  </ContactLink>
                  <ContactLink
                    onClick={(e) => e.stopPropagation()}
                    href="https://linkedin.com/in/adamhakarsa"
                    target="_blank"
                    rel="noreferrer"
                  >
                    💼 linkedin.com/in/adamhakarsa
                  </ContactLink>
                </LinkList>
              </div>
              <BackHint>← Click to go back</BackHint>
            </>
          }
          styles={{
            frontStyle: css`
              background-color: #0077b5;
              padding: 24px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              color: #fff;
            `,
            backStyle: css`
              background-color: #004182;
              padding: 24px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              color: #fff;
            `,
          }}
        >
          <div>
            <FrontLabel>CEO</FrontLabel>
            <FrontName>Adam Hakarsa</FrontName>
            <FrontRole>Systatum · adam@systatum.com</FrontRole>
          </div>
          <FrontHint>Click to see links →</FrontHint>
        </Flippable>
        <div style={{ display: "flex", gap: "4px" }}>
          <Button onClick={() => ref.current?.flip()}>Show back</Button>
          <Button onClick={() => ref.current?.unFlip()}>Show front</Button>
          <Button onClick={() => ref.current?.toggle()}>Toggle</Button>
        </div>
      </div>
    );
  },
};
