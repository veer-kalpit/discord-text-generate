import { Container, Title, Text } from "@mantine/core";
import ColorTextGenerator from "./components/ColorTextGenerator";

export default function Home() {
  return (
    <Container size="sm" pt="xl">
      <Title style={{ textAlign: "center" }}>
        Discord Colored Text Generator
      </Title>

      <Text style={{ textAlign: "center" }} mt="sm" color="dimmed">
        Generate colored text for Discord using code blocks.
      </Text>
      <Title style={{ textAlign: "center" }} mt="sm">
        How It Works
      </Title>
      <Text style={{ textAlign: "center" }} mt="sm">
        1 . Write Yor Text
      </Text>
      <Text style={{ textAlign: "center" }} mt="sm">
        2 . Select the letter from preview to change its style
      </Text>
      <Text style={{ textAlign: "center" }} mt="sm">
        3. Copy the generated code and paste it in Discord
      </Text>
      <ColorTextGenerator />

      <Text style={{ textAlign: "center" }} mt="lg">
        Made by{" "}
        {["K", "a", "l", "p", "i", "t", " ", "T", "h", "a", "k", "u", "r"].map(
          (char, index) => (
            <span
              key={index}
              style={{
                color: [
                  "#FF5733",
                  "#33FF57",
                  "#3357FF",
                  "#FF33A8",
                  "#FFD700",
                  "#FF4500",
                  "#000000",
                  "#9400D3",
                  "#00FFFF",
                  "#FFA07A",
                  "#7FFF00",
                  "#FF1493",
                ][index], 
                fontWeight: "bold",
                fontSize: "40px",
              }}
            >
              {char}
            </span>
          )
        )}
      </Text>
    </Container>
  );
}
