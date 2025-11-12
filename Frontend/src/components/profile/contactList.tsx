import { ReactNode } from "react";

interface ContactItem {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}

interface ContactListProps {
  title?: string;
  contacts: ContactItem[];
}

export default function ContactList({ title, contacts }: ContactListProps) {
  return (
    <div>
      {title && (
        <h3 className="text-xl font-bold text-gray-900 mb-6">{title}</h3>
      )}
      <div className="grid md:grid-cols-2 gap-6">
        {contacts.map((c, idx) => {
          const isWebsite =
            typeof c.value === "string" &&
            (c.label.toLowerCase().includes("website") ||
              /^https?:\/\//.test(c.value));

          return (
            <div key={idx} className="flex items-start gap-3">
              <div className="bg-orange-600 p-2 rounded flex-shrink-0">{c.icon}</div>
              <div>
                <p className="text-sm text-gray-600">{c.label}</p>
                {isWebsite ? (
                  <a
                    href={c.value as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-orange-600 hover:underline break-words"
                  >
                    {c.value}
                  </a>
                ) : (
                  <p className="font-medium text-gray-900 break-words">
                    {c.value}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

