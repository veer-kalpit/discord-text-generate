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
      <ColorTextGenerator />
    </Container>
  );
}
