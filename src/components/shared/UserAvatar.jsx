import { useState } from "react";
import { UserCircle } from "lucide-react";

export default function UserAvatar({ src, alt, size = 32 }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <UserCircle
        style={{ width: size, height: size }}
        className="text-slate-400"
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="rounded-full object-cover"
      onError={() => setError(true)}
    />
  );
}
