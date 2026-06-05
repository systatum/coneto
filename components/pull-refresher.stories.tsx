import { Meta, StoryObj } from "@storybook/react/*";
import { PullRefresher } from "./pull-refresher";
import { Card } from "./card";
import { css } from "styled-components";
import { useTheme } from "./../theme";
import { List } from "./list";
import { useState } from "react";

const meta: Meta<typeof PullRefresher> = {
  title: "Mobile/Pull Refresher",
  component: PullRefresher,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
 `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof PullRefresher>;

export const Default: Story = {
  render: () => {
    const { currentTheme } = useTheme();
    const cardTheme = currentTheme.card;

    const CHATS = [
      {
        id: "1",
        name: "Alim Naufal",
        time: "20:31",
        message: "Finished the PullRefresher component 🎉",
      },
      {
        id: "2",
        name: "Adam Noto",
        time: "20:15",
        message: "Can you review my PR when you have time?",
      },
      {
        id: "3",
        name: "John Doe",
        time: "19:48",
        message: "The deployment completed successfully.",
      },
      {
        id: "4",
        name: "Emma Wilson",
        time: "18:22",
        message: "Let's sync tomorrow morning.",
      },
    ];

    const [items, setItems] = useState(CHATS);

    const messages = [
      "Hey, are you available?",
      "The build passed successfully.",
      "Can you review this component?",
      "Nice work on the design system!",
      "Storybook docs look great.",
      "The mobile version feels smoother now.",
      "Pull to refresh is working perfectly.",
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    const FIRST_NAMES = [
      "Adam",
      "Alim",
      "Sarah",
      "Michael",
      "Emma",
      "Daniel",
      "Sophia",
      "Olivia",
      "Noah",
      "Lucas",
      "Mia",
      "Ethan",
      "Ava",
      "James",
      "Grace",
      "Henry",
    ];

    const LAST_NAMES = [
      "Noto",
      "Wilson",
      "Naufal",
      "Johnson",
      "Anderson",
      "Taylor",
      "Brown",
      "Martinez",
      "Kim",
      "Chen",
      "Park",
      "Lee",
      "Clark",
      "Walker",
      "Scott",
      "Davis",
    ];

    const randomName = () => {
      const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];

      const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];

      return `${first} ${last}`;
    };

    const fetchNewData = () => {
      const name = randomName();
      setItems((prev) => [
        {
          id: crypto.randomUUID(),
          name,
          avatar: `https://picsum.photos/seed/${Date.now()}/200`,
          time: "Just now",
          message: randomMessage,
        },
        ...prev,
      ]);
    };

    return (
      <Card
        styles={{
          containerStyle: css`
            width: 100%;
          `,
          titleStyle: css`
            text-align: center;
            justify-content: center;
          `,
          headerStyle: css`
            border-bottom: 1px solid ${cardTheme?.borderColor};
          `,
          contentStyle: css`
            overflow: auto;
            display: flex;
          `,
        }}
        title="Pull Refresher"
      >
        <PullRefresher
          onLoading={async ({ stopLoading }) => {
            setTimeout(() => {
              fetchNewData();

              stopLoading();
            }, 1000);
          }}
        >
          {items.map((chat) => (
            <List.Item
              key={chat.id}
              id={chat.id}
              icon={{
                image: `https://picsum.photos/seed/${encodeURIComponent(chat.name)}/200`,
                size: 30,
                styles: {
                  self: css`
                    border-radius: 9999px;
                    overflow: hidden;

                    img {
                      transform: scale(1.2);
                    }
                  `,
                },
              }}
              styles={{
                titleStyle: css`
                  display: flex;
                  flex-direction: row;
                  gap: 2px;
                  justify-content: space-between;
                `,
              }}
              title={
                <>
                  <div>{chat.name}</div>
                  <div
                    style={{
                      color: cardTheme.subtitleColor,
                      fontSize: "12px",
                    }}
                  >
                    {chat.time}
                  </div>
                </>
              }
              subtitle={chat.message}
            />
          ))}
        </PullRefresher>
      </Card>
    );
  },
};
