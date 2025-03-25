"use client";

import { useState } from "react";
import { Textarea, Button, Paper, Group, Box, Title } from "@mantine/core";
import {
  IconBold,
  IconUnderline,
  IconCopy,
  IconEraser,
} from "@tabler/icons-react";

const colors = [
  "#4f545c",
  "#dc322f",
  "#859900",
  "#b58900",
  "#268bd2",
  "#d33682",
  "#2aa198",
  "#ffffff",
  "#002b36",
  "#cb4b16",
  "#586e75",
  "#657b83",
  "#839496",
  "#6c71c4",
  "#93a1a1",
  "#fdf6e3",
];

interface LetterStyle {
  text: string;
  fg?: string;
  bg?: string;
  bold?: boolean;
  underline?: boolean;
}

const ColorTextGenerator = () => {
  const [letters, setLetters] = useState<LetterStyle[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [inputText, setInputText] = useState("");
  const [defaultFg, setDefaultFg] = useState<string | undefined>();
  const [defaultBg, setDefaultBg] = useState<string | undefined>();

  // Convert Hex to RGB
  const rgbFromHex = (hex: string): [number, number, number] => {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  };

  // Update letters as user types
  const updateLetters = (text: string): void => {
    setInputText(text);
    setLetters(
      text.split("").map((char, index) => ({
        text: char,
        fg: letters[index]?.fg || defaultFg,
        bg: letters[index]?.bg || defaultBg,
        bold: letters[index]?.bold,
        underline: letters[index]?.underline,
      }))
    );
  };

  // Apply formatting to the selected letter
  const updateSelectedLetter = (update: Partial<LetterStyle>): void => {
    if (selectedIndex === null) return;
    setLetters((prevLetters) => {
      const updatedLetters = [...prevLetters];
      updatedLetters[selectedIndex] = {
        ...updatedLetters[selectedIndex],
        ...update,
      };
      return updatedLetters;
    });
  };

  // Apply only color to selected letter
  const updateSelectedLetterColor = (
    color: string,
    isForeground: boolean
  ): void => {
    if (selectedIndex !== null) {
      setLetters((prevLetters) => {
        const updatedLetters = [...prevLetters];
        updatedLetters[selectedIndex] = {
          ...updatedLetters[selectedIndex],
          ...(isForeground ? { fg: color } : { bg: color }),
        };
        return updatedLetters;
      });
    } else {
      if (isForeground) setDefaultFg(color);
      else setDefaultBg(color);
    }
  };

  // Reset everything
  const resetAll = (): void => {
    setLetters([]);
    setInputText("");
    setSelectedIndex(null);
    setDefaultFg(undefined);
    setDefaultBg(undefined);
  };

  // Generate Discord-formatted text with ANSI colors
  const generateDiscordText = (): string => {
    let result = "```ansi\n";
    let prevFg: string | null = null;
    let prevBg: string | null = null;

    letters.forEach(({ text, fg, bg, bold, underline }) => {
      let ansiCode = "";

      // Apply foreground color if changed
      if (fg && fg !== prevFg) {
        const [r, g, b] = rgbFromHex(fg);
        ansiCode += `\x1b[38;2;${r};${g};${b}m`;
        prevFg = fg;
      }

      // Apply background color if changed
      if (bg && bg !== prevBg) {
        const [r, g, b] = rgbFromHex(bg);
        ansiCode += `\x1b[48;2;${r};${g};${b}m`;
        prevBg = bg;
      }

      // Apply bold and underline
      if (bold) ansiCode += "\x1b[1m";
      if (underline) ansiCode += "\x1b[4m";

      result += ansiCode + text;
    });

    result += "\x1b[0m\n```"; // Reset at the end
    return result;
  };

  return (
    <Paper shadow="xs" p="md" mt="md" radius="md">
      {/* Text Input */}
      <Textarea
        label="Enter your text"
        placeholder="Type here..."
        value={inputText}
        onChange={(e) => updateLetters(e.currentTarget.value)}
        minRows={3}
      />

      {/* Foreground Color Selection */}
      <Box mt="md">
        <Title order={5}>Foreground Color</Title>
        <Group gap="xs">
          {colors.map((color) => (
            <Box
              key={color}
              style={{
                width: "24px",
                height: "24px",
                backgroundColor: color,
                cursor: "pointer",
                borderRadius: "4px",
                border: defaultFg === color ? "2px solid #fff" : "none",
              }}
              onClick={() => updateSelectedLetterColor(color, true)}
            />
          ))}
        </Group>
      </Box>

      {/* Background Color Selection */}
      <Box mt="sm">
        <Title order={5}>Background Color</Title>
        <Group gap="xs">
          {colors.map((color) => (
            <Box
              key={color}
              style={{
                width: "24px",
                height: "24px",
                backgroundColor: color,
                cursor: "pointer",
                borderRadius: "4px",
                border: defaultBg === color ? "2px solid #fff" : "none",
              }}
              onClick={() => updateSelectedLetterColor(color, false)}
            />
          ))}
        </Group>
      </Box>

      {/* Formatting Options */}
      <Group mt="md">
        <Button
          onClick={() => updateSelectedLetter({ bold: true })}
          leftSection={<IconBold size={16} />}
        >
          Bold
        </Button>
        <Button
          onClick={() => updateSelectedLetter({ underline: true })}
          leftSection={<IconUnderline size={16} />}
        >
          Underline
        </Button>
        <Button
          color="red"
          onClick={resetAll}
          leftSection={<IconEraser size={16} />}
        >
          Reset
        </Button>
      </Group>

      {/* Live Preview */}
      <Paper
        mt="md"
        p="xs"
        radius="md"
        style={{ minHeight: "80px", color: "#fff", background: "#333" }}
      >
        {letters.map((letter, index) => (
          <span
            key={index}
            onClick={() => setSelectedIndex(index)}
            style={{
              color: letter.fg || "inherit",
              backgroundColor: letter.bg || "transparent",
              fontWeight: letter.bold ? "bold" : "normal",
              textDecoration: letter.underline ? "underline" : "none",
              padding: letter.bg ? "2px 4px" : "0",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {letter.text}
          </span>
        ))}
      </Paper>

      {/* Copy Button */}
      <Group mt="md">
        <Button
          leftSection={<IconCopy />}
          onClick={() => navigator.clipboard.writeText(generateDiscordText())}
        >
          Copy as Discord Formatted Text
        </Button>
      </Group>
    </Paper>
  );
};

export default ColorTextGenerator;
