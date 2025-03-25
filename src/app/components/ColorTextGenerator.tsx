"use client";

import { useState } from "react";
import { Textarea, Button, Paper, Group, Box, Title } from "@mantine/core";
import {
  IconBold,
  IconUnderline,
  IconCopy,
  IconEraser,
} from "@tabler/icons-react";

// Discord ANSI color codes
const ansiColors: { [key: string]: { fg: string; bg: string; hex: string } } = {
  black: { fg: "30", bg: "40", hex: "#000000" },
  red: { fg: "31", bg: "41", hex: "#ff0000" },
  green: { fg: "32", bg: "42", hex: "#00ff00" },
  yellow: { fg: "33", bg: "43", hex: "#ffff00" },
  blue: { fg: "34", bg: "44", hex: "#0000ff" },
  magenta: { fg: "35", bg: "45", hex: "#ff00ff" },
  cyan: { fg: "36", bg: "46", hex: "#00ffff" },
  white: { fg: "37", bg: "47", hex: "#ffffff" },
};

const colorOptions = Object.keys(ansiColors);

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

  const updateLetters = (text: string) => {
    setInputText(text);
    setLetters(
      text.split("").map((char, index) => ({
        text: char,
        fg: letters[index]?.fg,
        bg: letters[index]?.bg,
        bold: letters[index]?.bold,
        underline: letters[index]?.underline,
      }))
    );
  };

  const updateSelectedLetter = (update: Partial<LetterStyle>) => {
    if (selectedIndex === null) return;
    setLetters((prev) => {
      const updated = [...prev];
      updated[selectedIndex] = { ...updated[selectedIndex], ...update };
      return updated;
    });
  };

  // Generate Proper ANSI for Discord
  const generateDiscordText = (): string => {
    let result = "```ansi\n";

    letters.forEach(({ text, fg, bg, bold, underline }) => {
      let ansiCode = "\x1b[";

      if (bold) ansiCode += "1;";
      if (underline) ansiCode += "4;";
      if (fg) ansiCode += ansiColors[fg].fg + ";";
      if (bg) ansiCode += ansiColors[bg].bg + ";";

      // Remove trailing semicolon & close bracket
      ansiCode = ansiCode.replace(/;$/, "") + "m";

      result += ansiCode + text + "\x1b[0m"; // Reset after each letter
    });

    result += "\n```"; // End ANSI block
    return result;
  };

  return (
    <Paper shadow="xs" p="md" mt="md" radius="md">
      <Textarea
        label="Enter your text"
        placeholder="Type here..."
        value={inputText}
        onChange={(e) => updateLetters(e.currentTarget.value)}
        minRows={3}
      />

      {/* Foreground Colors */}
      <Box mt="md">
        <Title order={5}>Text Color</Title>
        <Group gap="xs">
          {colorOptions.map((color) => (
            <Box
              key={color}
              style={{
                width: "24px",
                height: "24px",
                backgroundColor: ansiColors[color].hex,
                cursor: "pointer",
                borderRadius: "4px",
                border:
                  letters[selectedIndex || 0]?.fg === color
                    ? "2px solid #fff"
                    : "none",
              }}
              onClick={() => updateSelectedLetter({ fg: color })}
            />
          ))}
        </Group>
      </Box>

      {/* Background Colors */}
      <Box mt="md">
        <Title order={5}>Background Color</Title>
        <Group gap="xs">
          {colorOptions.map((color) => (
            <Box
              key={color}
              style={{
                width: "24px",
                height: "24px",
                backgroundColor: ansiColors[color].hex,
                cursor: "pointer",
                borderRadius: "4px",
                border:
                  letters[selectedIndex || 0]?.bg === color
                    ? "2px solid #fff"
                    : "none",
              }}
              onClick={() => updateSelectedLetter({ bg: color })}
            />
          ))}
        </Group>
      </Box>

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
          onClick={() => setLetters([])}
          leftSection={<IconEraser size={16} />}
        >
          Reset
        </Button>
      </Group>

      {/* Live Preview (Uses CSS, Not ANSI) */}
      <Paper
        mt="md"
        p="xs"
        radius="md"
        style={{
          minHeight: "80px",
          background: "#222",
          color: "#fff",
          padding: "8px",
        }}
      >
        {letters.map((letter, index) => (
          <span
            key={index}
            onClick={() => setSelectedIndex(index)}
            style={{
              color: letter.fg ? ansiColors[letter.fg].hex : "inherit",
              backgroundColor: letter.bg
                ? ansiColors[letter.bg].hex
                : "transparent",
              fontWeight: letter.bold ? "bold" : "normal",
              textDecoration: letter.underline ? "underline" : "none",
              cursor: "pointer",
              padding: letter.bg ? "2px 4px" : "0",
              borderRadius: "4px",
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
