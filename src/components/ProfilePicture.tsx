import { Image } from "expo-image";

type Props = {
  isSeq: boolean;
} & Image["props"];

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export function PorfilePicture({ isSeq, ...rest }: Props) {
  return (
    <Image
      source="https://avatars.githubusercontent.com/u/57598810?v=4"
      style={{
        opacity: isSeq ? 0 : 1,
        width: 30,
        height: 30,
        borderRadius: 999,
        marginRight: 10,
      }}
      placeholder={{ blurhash }}
      contentFit="cover"
      transition={1000}
      {...rest}
    />
  );
}
