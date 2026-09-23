"use client";

import { Editor } from "@tinymce/tinymce-react";
import type { Editor as TinyMCEEditor } from "tinymce";
import { useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";

interface BlogEditorProps {
  value: string;
  onChange: (html: string) => void;
}

async function uploadImage(blobInfo: { blob: () => Blob; filename: () => string }) {
  const form = new FormData();
  form.append("file", blobInfo.blob(), blobInfo.filename());
  const result = await apiFetch<{ url: string }>("/admin/uploads", {
    method: "POST",
    body: form,
  });
  return result.url;
}

export function BlogEditor({ value, onChange }: BlogEditorProps) {
  const [uploadError, setUploadError] = useState("");

  return (
    <div className="flex flex-col gap-2">
      <Editor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        licenseKey="gpl"
        value={value}
        onEditorChange={onChange}
        init={{
          promotion: false,
          branding: false,
          height: 500,
          menubar: false,
          plugins: "lists link image",
          toolbar:
            "undo redo | blocks | bold italic | bullist numlist | blockquote | link image | inlinecode",
          paste_data_images: true,
          images_upload_handler: async (blobInfo) => {
            setUploadError("");
            try {
              return await uploadImage(blobInfo);
            } catch (err) {
              const message =
                err instanceof ApiError ? err.message : "Error al subir la imagen";
              setUploadError(message);
              throw new Error(message);
            }
          },
          setup: (editor: TinyMCEEditor) => {
            editor.ui.registry.addToggleButton("inlinecode", {
              icon: "sourcecode",
              tooltip: "Codigo en linea",
              onAction: () => editor.execCommand("mceToggleFormat", false, "code"),
              onSetup: (api) =>
                editor.formatter.formatChanged("code", (state) => api.setActive(state)).unbind,
            });
          },
        }}
      />
      {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}
    </div>
  );
}
