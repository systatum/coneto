import { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from "./sidebar";
import { ChangeEvent, useMemo, useState } from "react";
import { Searchbox } from "./searchbox";
import { TreeList } from "./treelist";
import { EmptySlate } from "./empty-slate";
import { Button } from "./button";

const meta: Meta<typeof Sidebar> = {
  title: "Stage/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState({
      title: "",
    });

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setValue((prev) => ({ ...prev, [name]: value }));
    };

    const setPerson = (item: { id: number; title: string }) => {
      console.log("Clicked person:", item.title);
    };

    const TREE_LIST_DATA = [
      {
        title: "Member of Technical Staff",
        items: [
          { id: 1, title: "Adam Noto Hakarsa", onClick: setPerson },
          { id: 2, title: "Mohamad Naufal Alim", onClick: setPerson },
        ],
      },
      {
        title: "Product Management Team",
        items: [
          { id: 1, title: "Samantha Lee", onClick: setPerson },
          { id: 2, title: "Jason Kim", onClick: setPerson },
          { id: 3, title: "Rina Patel", onClick: setPerson },
        ],
      },
    ];

    const FILTERED_CONTENT = useMemo(() => {
      if (TREE_LIST_DATA.length === 0) return [];

      return TREE_LIST_DATA.map((data) => ({
        ...data,
        items: data.items.filter((val) =>
          val.title.toLowerCase().includes(value.title.toLowerCase())
        ),
      })).filter((data) => data.items.length > 0);
    }, [TREE_LIST_DATA, value]);

    return (
      <div className="flex flex-row w-full justify-between">
        <Sidebar position="left">
          <Sidebar.Item>
            <Searchbox
              name="title"
              value={value.title}
              onChange={onChangeValue}
            />
          </Sidebar.Item>
          <Sidebar.Item>
            <TreeList
              content={FILTERED_CONTENT}
              emptySlate={
                <EmptySlate
                  imageUrl="https://picsum.photos/200?random=1"
                  title="No Matches"
                  subtitle="We couldn't find any person or team that matches your search."
                  containerStyle={{
                    textAlign: "center",
                    alignItems: "center",
                  }}
                  imageStyle={{
                    maxWidth: "200px",
                  }}
                  actions={
                    <>
                      <Button variant="default" className="text-xs">
                        Clear Search
                      </Button>
                      <Button variant="primary" className="text-xs">
                        Add Member
                      </Button>
                    </>
                  }
                />
              }
              searchTerm={value.title}
            />
          </Sidebar.Item>
        </Sidebar>
        <Sidebar.Spacer />
        <div className="items-center min-h-screen justify-center flex w-full">
          Empty Content
        </div>
      </div>
    );
  },
};

export const FixedRight: Story = {
  render: () => {
    const [value, setValue] = useState({
      title: "",
    });

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setValue((prev) => ({ ...prev, [name]: value }));
    };

    const setPerson = (item: { id: number; title: string }) => {
      console.log("Clicked person:", item.title);
    };

    const TREE_LIST_DATA = [
      {
        title: "Member of Technical Staff",
        items: [
          { id: 1, title: "Adam Noto Hakarsa", onClick: setPerson },
          { id: 2, title: "Mohamad Naufal Alim", onClick: setPerson },
        ],
      },
      {
        title: "Product Management Team",
        items: [
          { id: 1, title: "Samantha Lee", onClick: setPerson },
          { id: 2, title: "Jason Kim", onClick: setPerson },
          { id: 3, title: "Rina Patel", onClick: setPerson },
        ],
      },
    ];

    const FILTERED_CONTENT = useMemo(() => {
      if (TREE_LIST_DATA.length === 0) return [];

      return TREE_LIST_DATA.map((data) => ({
        ...data,
        items: data.items.filter((val) =>
          val.title.toLowerCase().includes(value.title.toLowerCase())
        ),
      })).filter((data) => data.items.length > 0);
    }, [TREE_LIST_DATA, value]);

    return (
      <div className="flex flex-row w-full justify-between">
        <div className="items-center min-h-screen justify-center flex w-full">
          Empty Content
        </div>
        <Sidebar.Spacer />
        <Sidebar position="right">
          <Sidebar.Item>
            <Searchbox
              name="title"
              value={value.title}
              onChange={onChangeValue}
            />
          </Sidebar.Item>
          <Sidebar.Item>
            <TreeList
              content={FILTERED_CONTENT}
              emptySlate={
                <EmptySlate
                  imageUrl="https://picsum.photos/200?random=1"
                  title="No Matches"
                  subtitle="We couldn't find any person or team that matches your search."
                  containerStyle={{
                    textAlign: "center",
                    alignItems: "center",
                  }}
                  imageStyle={{
                    maxWidth: "200px",
                  }}
                  actions={
                    <>
                      <Button variant="default" className="text-xs">
                        Clear Search
                      </Button>
                      <Button variant="primary" className="text-xs">
                        Add Member
                      </Button>
                    </>
                  }
                />
              }
              searchTerm={value.title}
            />
          </Sidebar.Item>
        </Sidebar>
      </div>
    );
  },
};
