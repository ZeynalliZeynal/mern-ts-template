import Stack from "@/components/ui/stack.tsx";
import AvatarGroup from "@/components/ui/avatar-group.tsx";

const avatars = [
  {
    username: "zeynal",
    avatar: "https://vercel.com/api/www/avatar?u=evilrabbit&s=64",
  },
  {
    username: "femil",
    avatar: "https://vercel.com/api/www/avatar?u=rauchg&s=64",
  },
  {
    username: "negrito",
    avatar: "https://vercel.com/api/www/avatar?u=leerob&s=64",
  },
  {
    username: "elmar",
    avatar: "https://vercel.com/api/www/avatar?u=sambecker&s=64",
  },
  {
    username: "josef",
    avatar: "https://vercel.com/api/www/avatar?u=rauno&s=64",
  },
  {
    username: "samir",
    avatar: "https://vercel.com/api/www/avatar?u=shuding&s=64",
  },
];

export default function AvatarsDemo() {
  return (
    <Stack gap={4}>
      <AvatarGroup members={avatars} size={32} limit={4} />
      <AvatarGroup members={avatars} size={32} />
    </Stack>
  );
}
