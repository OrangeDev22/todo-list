"use client";
import { XMarkIcon } from "@heroicons/react/24/solid";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";

type Position = "top" | "bottom" | "left" | "right";

type Props = {
  children: React.ReactNode;
  items: { key: string; label: string; className?: string }[];
  headerTitle?: string;
  menuClassName?: string;
  itemMenuClassName?: string;
  listClassName?: string;
  position?: Position;
  onActionClicked: (key: string) => void;
};

function MenuDropDown({
  children,
  items,
  menuClassName,
  itemMenuClassName,
  listClassName,
  headerTitle,
  position = "bottom",
  onActionClicked,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  const handleToggleDropdown = () => {
    setAnchorRect(anchorRef.current?.getBoundingClientRect() || null);
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      anchorRef.current &&
      !anchorRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const calculatePosition = () => {
    if (!anchorRect) return {};
    const styles: React.CSSProperties = { position: "absolute" };

    switch (position) {
      case "top":
        styles.top = `${anchorRect.top - 8}px`;
        styles.left = `${anchorRect.left}px`;
        styles.transform = "translateY(-100%)";
        break;
      case "bottom":
        styles.top = `${anchorRect.bottom + 8}px`;
        styles.left = `${anchorRect.left}px`;
        break;
      case "left":
        styles.top = `${anchorRect.top}px`;
        styles.left = `${anchorRect.left - 8}px`;
        styles.transform = "translateX(-100%)";
        break;
      case "right":
        styles.top = `${anchorRect.top}px`;
        styles.left = `${anchorRect.right + 8}px`;
        break;
      default:
        break;
    }

    return styles;
  };

  return (
    <>
      <div
        className="inline-block"
        ref={anchorRef}
        onClick={handleToggleDropdown}
      >
        {children}
      </div>

      {isOpen &&
        anchorRect &&
        createPortal(
          <div
            ref={dropdownRef}
            style={calculatePosition()}
            className={twMerge(
              "z-50 bg-white rounded-md shadow-lg w-48",
              menuClassName
            )}
          >
            <div className="min-w-full flex items-center p-3">
              <h1 className="font-semibold flex-grow text-center">
                {headerTitle}
              </h1>
              <button
                className="hover:bg-neutral-700 p-1 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                <XMarkIcon width={20} className="ml-auto" />
              </button>
            </div>
            <ul className={twMerge("py-2", listClassName)}>
              {items.map((item) => (
                <div
                  key={item.key}
                  className={twMerge(
                    `block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
                      item.className || "text-gray-700"
                    }`,
                    itemMenuClassName
                  )}
                  onClick={() => {
                    onActionClicked(item.key);
                    setIsOpen(false);
                  }}
                >
                  {item.label}
                </div>
              ))}
            </ul>
          </div>,
          document.body
        )}
    </>
  );
}

export default MenuDropDown;
