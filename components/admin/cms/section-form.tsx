"use client";

import { useState } from "react";
import { SimpleImageUpload } from "@/components/FormInputs/SimpleImageUpload";
import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";

interface SectionFormProps {
  data: any;
  onChange: (newData: any) => void;
}

export function SectionForm({ data, onChange }: SectionFormProps) {
  if (!data) return null;

  // If the section itself is an array
  if (Array.isArray(data)) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between bg-secondary/20 p-2 rounded-lg border border-border">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-navy">List Items</span>
            <span className="text-[9px] text-muted-foreground">{data.length} entries</span>
          </div>
          <button
            onClick={() => {
              const template = data.length > 0 ? { ...data[0] } : { title: "New Item", id: Date.now() };
              Object.keys(template).forEach(key => {
                if (key === "id") template[key] = Date.now();
                else if (typeof template[key] === "string") template[key] = "";
                else if (typeof template[key] === "number") template[key] = 0;
              });
              onChange([...data, template]);
            }}
            className="px-3 py-1.5 bg-teal text-white rounded shadow-md text-[10px] font-bold hover:bg-teal-dark transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-3 h-3" /> Add Item
          </button>
        </div>
        <div className="space-y-3">
          {data.length === 0 ? (
            <div className="py-8 text-center bg-card rounded-xl border-2 border-dashed border-border flex flex-col items-center gap-3">
              <Plus className="w-8 h-8 text-muted-foreground/40" />
              <p className="text-[10px] font-semibold text-foreground">Empty list</p>
              <button
                onClick={() => onChange([{ title: "New Item", id: Date.now() }])}
                className="px-4 py-2 bg-teal text-white rounded-lg shadow-sm text-[10px] font-bold hover:bg-teal-dark transition-all"
              >
                Create First Item
              </button>
            </div>
          ) : (
            data.map((item, idx) => (
              <ObjectArrayItem
                key={idx}
                index={idx}
                item={item}
                onChange={(newItem) => {
                  const newArr = [...data];
                  newArr[idx] = newItem;
                  onChange(newArr);
                }}
                onRemove={() => onChange(data.filter((_, i) => i !== idx))}
              />
            ))
          )}
        </div>
      </div>
    );
  }

  // Normal nested object section
  return (
    <div className="space-y-4">
      {Object.entries(data).map(([key, value]) => (
        <FieldRenderer
          key={key}
          fieldKey={key}
          value={value}
          onChange={(newVal) => onChange({ ...data, [key]: newVal })}
        />
      ))}
    </div>
  );
}

function FieldRenderer({
  fieldKey,
  value,
  onChange,
}: {
  fieldKey: string;
  value: any;
  onChange: (val: any) => void;
}) {
  const k = fieldKey.toLowerCase();

  // Skip automated fields
  const hiddenFields = ["id", "size", "type", "date"];
  if (hiddenFields.includes(k)) return null;

  const isImage = k.includes("image") || k.includes("src") || k.includes("logo") || k.includes("icon") || k.includes("avatar");

  // Array of strings
  if (Array.isArray(value) && (value.length === 0 || typeof value[0] === "string")) {
    return (
      <div className="space-y-2 border border-border rounded-lg p-2 bg-secondary/10">
        <div className="flex items-center justify-between mb-1">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{fieldKey}</label>
          <button
            onClick={() => onChange([...value, ""])}
            className="px-2 py-1 bg-teal text-white rounded shadow-sm text-[9px] font-bold hover:bg-teal-dark transition-all flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {value.length === 0 ? (
            <p className="text-[9px] text-muted-foreground italic py-2 text-center bg-background/50 rounded border border-dashed border-border">
              No items yet
            </p>
          ) : (
            value.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <textarea
                  value={item}
                  onChange={(e) => {
                    const newArr = [...value];
                    newArr[idx] = e.target.value;
                    onChange(newArr);
                  }}
                  className="flex-1 min-h-[50px] text-[10px] px-2 py-1.5 rounded-md border border-input bg-background resize-y"
                />
                <button
                  onClick={() => onChange(value.filter((_, i) => i !== idx))}
                  className="shrink-0 flex items-center gap-1 px-2 py-1 text-[9px] text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors h-fit mt-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Array of objects
  if (Array.isArray(value) && (value.length === 0 || typeof value[0] === "object")) {
    return (
      <div className="space-y-2 border border-border rounded-lg p-2 bg-secondary/10">
        <div className="flex items-center justify-between mb-1">
          <div className="flex flex-col">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{fieldKey}</label>
            <span className="text-[9px] text-muted-foreground/60">{value.length} items</span>
          </div>
          <button
            onClick={() => {
              const template = value.length > 0 ? { ...value[0] } : { title: "New Item", id: Date.now() };
              Object.keys(template).forEach(key => {
                if (key === "id") template[key] = Date.now();
                else if (typeof template[key] === "string") template[key] = "";
                else if (typeof template[key] === "number") template[key] = 0;
              });
              onChange([...value, template]);
            }}
            className="px-2 py-1 bg-teal text-white rounded shadow-sm text-[9px] font-bold hover:bg-teal-dark transition-all flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {value.length === 0 ? (
            <div className="py-6 text-center bg-background/50 rounded-lg border-2 border-dashed border-border flex flex-col items-center gap-2">
              <Plus className="w-6 h-6 text-muted-foreground/40" />
              <p className="text-[9px] font-semibold text-muted-foreground">List is empty</p>
              <button
                onClick={() => onChange([{ title: "New Item", id: Date.now() }])}
                className="px-3 py-1.5 bg-teal/10 text-teal hover:bg-teal hover:text-white rounded text-[9px] font-bold transition-all"
              >
                Create First Item
              </button>
            </div>
          ) : (
            value.map((item, idx) => (
              <ObjectArrayItem
                key={idx}
                index={idx}
                item={item}
                onChange={(newItem) => {
                  const newArr = [...value];
                  newArr[idx] = newItem;
                  onChange(newArr);
                }}
                onRemove={() => onChange(value.filter((_, i) => i !== idx))}
              />
            ))
          )}
        </div>
      </div>
    );
  }

  // Nested Object
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    return (
      <div className="space-y-2 border border-border rounded-lg p-3 bg-secondary/5">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-navy">{fieldKey}</label>
        <div className="pl-2 border-l-2 border-border/50 space-y-3">
          {Object.entries(value).map(([k, v]) => (
            <FieldRenderer
              key={k}
              fieldKey={k}
              value={v}
              onChange={(newVal) => onChange({ ...value, [k]: newVal })}
            />
          ))}
        </div>
      </div>
    );
  }

  // Image field
  if (typeof value === "string" && isImage) {
    return (
      <div className="space-y-1">
        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{fieldKey}</label>
        <SimpleImageUpload value={value} onChange={onChange} />
      </div>
    );
  }

  // Boolean
  if (typeof value === "boolean") {
    return (
      <label className="flex items-center gap-2 cursor-pointer py-1">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="w-3.5 h-3.5 rounded border-input text-teal focus:ring-teal"
        />
        <span className="text-[10px] font-semibold text-navy">{fieldKey}</span>
      </label>
    );
  }

  // Number
  if (typeof value === "number") {
    return (
      <div className="space-y-1">
        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{fieldKey}</label>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full text-[10px] px-2 py-1.5 rounded-md border border-input bg-background"
        />
      </div>
    );
  }

  // Long string (textarea)
  if (typeof value === "string" && value.length > 50) {
    return (
      <div className="space-y-1">
        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{fieldKey}</label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-h-[60px] text-[10px] px-2 py-1.5 rounded-md border border-input bg-background resize-y"
        />
      </div>
    );
  }

  // Short string (input text)
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{fieldKey}</label>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-[10px] px-2 py-1.5 rounded-md border border-input bg-background"
      />
    </div>
  );
}

function ObjectArrayItem({
  index,
  item,
  onChange,
  onRemove,
}: {
  index: number;
  item: any;
  onChange: (val: any) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(index === 0);

  const titleKey = Object.keys(item).find((k) =>
    ["title", "name", "heading", "label", "question", "text"].includes(k.toLowerCase())
  );
  const title = titleKey ? item[titleKey] : `Item ${index + 1}`;

  return (
    <div className="border border-border rounded bg-background shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-2 py-1.5 bg-secondary/30">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex flex-1 items-center gap-1.5 text-[10px] font-semibold text-navy hover:text-teal transition-colors text-left py-1 min-w-0"
        >
          {expanded ? <ChevronDown className="w-3 h-3 shrink-0" /> : <ChevronRight className="w-3 h-3 shrink-0" />}
          <span className="truncate">{title || "Untitled Item"}</span>
        </button>
        <button
          onClick={onRemove}
          className="flex items-center gap-1 px-2 py-1 text-[9px] font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors shrink-0"
          title="Remove item"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
      {expanded && (
        <div className="p-2 border-t border-border space-y-3 bg-background">
          {Object.entries(item).map(([k, v]) => (
            <FieldRenderer
              key={k}
              fieldKey={k}
              value={v}
              onChange={(newVal) => onChange({ ...item, [k]: newVal })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
