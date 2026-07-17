import Image from "next/image";

export function Logo({ size = 128 }: { size?: number }) {
  return (
    <div
      className="relative rounded-full overflow-hidden shadow-sm ring-1 ring-frame/60 bg-[#EDEBE2]"
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo.png"
        alt="نوش‌جان"
        fill
        sizes={`${size}px`}
        className="object-cover"
        priority
      />
    </div>
  );
}
