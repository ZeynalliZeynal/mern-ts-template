import { cn } from "@/lib/utils.ts";

interface AvatarGroupProps {
  limit?: number;
  members: { username: string; avatar: string }[];
  size?: number;
  placeholder?: boolean;
}

export default function AvatarGroup({
  limit,
  members,
  size,
  placeholder,
}: AvatarGroupProps) {
  if (limit === 0) return null;
  return (
    <div className="flex items-center">
      {members.map(
        (m, i) =>
          i < (limit || i + 1) && (
            <span
              key={i}
              className={cn(
                "inline-flex items-center justify-center rounded-full overflow-hidden border",
                {
                  "-ml-2.5": i !== 0,
                },
              )}
              style={{
                width: size,
                height: size,
              }}
            >
              {placeholder ? (
                <span className="size-full" />
              ) : (
                <img src={m.avatar} alt={m.username} title={m.username} />
              )}
            </span>
          ),
      )}
      {limit && limit < members.length && (
        <span
          className={cn(
            "rounded-full border bg-gray-100 -ml-2.5 inline-flex items-center justify-center text-xs select-none",
          )}
          style={{
            width: size,
            height: size,
          }}
        >
          +{members.length - limit}
        </span>
      )}
    </div>
  );
}
