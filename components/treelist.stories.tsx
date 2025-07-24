import { Meta, StoryObj } from "@storybook/react";
import { TreeList, TreeListActionsProps } from "./treelist";
import { RiAtLine, RiSearchLine } from "@remixicon/react";
import { EmptySlate } from "./empty-slate";
import { Button } from "./button";

const meta: Meta<typeof TreeList> = {
  title: "Content/TreeList",
  component: TreeList,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof TreeList>;

export const Default: Story = {
  render: () => {
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
          { id: 2, title: "alim Kim", onClick: setPerson },
          { id: 3, title: "Rina Patel", onClick: setPerson },
        ],
      },
    ];

    return (
      <div className="flex flex-col gap-1 max-w-[250px]">
        <TreeList content={TREE_LIST_DATA} emptySlate={<p>Not found.</p>} />
      </div>
    );
  },
};

export const WithActions: Story = {
  render: () => {
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
          { id: 2, title: "alim Kim", onClick: setPerson },
          { id: 3, title: "Rina Patel", onClick: setPerson },
        ],
      },
    ];

    const TREE_LIST_ACTIONS: TreeListActionsProps[] = [
      {
        title: "Discover",
        onClick: () => {
          console.log("Discover clicked");
        },
        icon: RiSearchLine,
      },
      {
        title: "Mention",
        onClick: () => {
          console.log("Mention clicked");
        },
        icon: RiAtLine,
      },
    ];

    return (
      <div className="flex flex-col gap-1 max-w-[250px]">
        <TreeList
          content={TREE_LIST_DATA}
          actions={TREE_LIST_ACTIONS}
          emptySlate={<p>Not found.</p>}
        />
      </div>
    );
  },
};

export const WithEmptySlate: Story = {
  render: () => {
    const TREE_LIST_DATA = [];

    const TREE_LIST_ACTIONS: TreeListActionsProps[] = [
      {
        title: "Discover",
        onClick: () => {
          console.log("Discover clicked");
        },
        icon: RiSearchLine,
      },
      {
        title: "Mention",
        onClick: () => {
          console.log("Mention clicked");
        },
        icon: RiAtLine,
      },
    ];

    return (
      <div className="flex flex-col gap-1 max-w-[250px]">
        <TreeList
          content={TREE_LIST_DATA}
          actions={TREE_LIST_ACTIONS}
          emptySlate={
            <EmptySlate
              imageUrl="https://picsum.photos/200?random=1"
              title="Manage your inventory transfers"
              containerClassName="max-w-[200px] text-center mx-auto"
              subtitle="Track and receive your incoming inventory from suppliers."
              actions={
                <>
                  <Button variant="default" className="text-xs">
                    Add Item
                  </Button>
                  <Button variant="primary" className="text-xs">
                    Learn More
                  </Button>
                </>
              }
            />
          }
        />
      </div>
    );
  },
};
