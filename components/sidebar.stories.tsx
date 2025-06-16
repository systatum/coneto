import { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from "./sidebar";
import { ChangeEvent, useMemo, useState } from "react";
import Searchbox from "./searchbox";
import { TreeList } from "./treelist";

const meta: Meta<typeof Sidebar> = {
  title: "Stage/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Sidebar>;

export const SidebarDefault: Story = {
  render: () => {
    const [value, setValue] = useState({
      label: "",
    });

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setValue((prev) => ({ ...prev, [name]: value }));
    };

    const setPerson = (item: { id: number; label: string }) => {
      console.log("Clicked person:", item.label);
    };

    const TREE_LIST_DATA = [
      {
        label: "Member of Technical Staff",
        items: [
          { id: 1, label: "Adam Noto Hakarsa", onClick: setPerson },
          { id: 2, label: "Mohamad Naufal Alim", onClick: setPerson },
        ],
      },
      {
        label: "Product Management Team",
        items: [
          { id: 1, label: "Samantha Lee", onClick: setPerson },
          { id: 2, label: "Jason Kim", onClick: setPerson },
          { id: 3, label: "Rina Patel", onClick: setPerson },
        ],
      },
    ];

    const FILTERED_CONTENT = useMemo(() => {
      if (TREE_LIST_DATA.length === 0) return [];

      return TREE_LIST_DATA.map((data) => ({
        ...data,
        items: data.items.filter((val) =>
          val.label.toLowerCase().includes(value.label.toLowerCase())
        ),
      })).filter((data) => data.items.length > 0);
    }, [TREE_LIST_DATA, value]);

    return (
      <div className="flex flex-row w-full justify-between">
        <Sidebar position="left">
          <Sidebar.Item>
            <Searchbox
              name="label"
              value={value.label}
              onChange={onChangeValue}
            />
          </Sidebar.Item>
          <Sidebar.Item>
            <TreeList
              content={FILTERED_CONTENT}
              emptySlate={
                <div className="text-sm font-semibold w-full items-center flex">
                  Not found.
                </div>
              }
              searchTerm={value.label}
            />
          </Sidebar.Item>
        </Sidebar>
        <div className="items-center justify-center flex w-full">
          Empty Content
        </div>
      </div>
    );
  },
};

export const SidebarPositionRight: Story = {
  render: () => {
    const [value, setValue] = useState({
      label: "",
    });

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setValue((prev) => ({ ...prev, [name]: value }));
    };

    const setPerson = (item: { id: number; label: string }) => {
      console.log("Clicked person:", item.label);
    };

    const TREE_LIST_DATA = [
      {
        label: "Member of Technical Staff",
        items: [
          { id: 1, label: "Adam Noto Hakarsa", onClick: setPerson },
          { id: 2, label: "Mohamad Naufal Alim", onClick: setPerson },
        ],
      },
      {
        label: "Product Management Team",
        items: [
          { id: 1, label: "Samantha Lee", onClick: setPerson },
          { id: 2, label: "Jason Kim", onClick: setPerson },
          { id: 3, label: "Rina Patel", onClick: setPerson },
        ],
      },
    ];

    const FILTERED_CONTENT = useMemo(() => {
      if (TREE_LIST_DATA.length === 0) return [];

      return TREE_LIST_DATA.map((data) => ({
        ...data,
        items: data.items.filter((val) =>
          val.label.toLowerCase().includes(value.label.toLowerCase())
        ),
      })).filter((data) => data.items.length > 0);
    }, [TREE_LIST_DATA, value]);

    return (
      <div className="flex flex-row w-full justify-between">
        <div className="items-center justify-center flex w-full">
          Empty Content
        </div>
        <Sidebar position="right">
          <Sidebar.Item>
            <Searchbox
              name="label"
              value={value.label}
              onChange={onChangeValue}
            />
          </Sidebar.Item>
          <Sidebar.Item>
            <TreeList
              content={FILTERED_CONTENT}
              emptySlate={
                <div className="text-sm font-semibold">Not found.</div>
              }
              searchTerm={value.label}
            />
          </Sidebar.Item>
        </Sidebar>
      </div>
    );
  },
};
