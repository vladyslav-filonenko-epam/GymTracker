import { Text } from 'react-native';

interface DefaultTextProps {
  text: string;
}

export const DefaultText = ({ text }: DefaultTextProps) => {
  return <Text>{text}</Text>;
};
