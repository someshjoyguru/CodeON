import React, { useState, useCallback } from 'react';
import { Button } from './button';
import { cn } from '../../lib/utils';

// A lightweight markdown helper editor (not full WYSIWYG) with quick insert buttons
export function RichTextEditor({ value, onChange, className, placeholder }) {
  const [local, setLocal] = useState(value || '');

  const apply = useCallback((wrapStart, wrapEnd = wrapStart) => {
    const selection = window.getSelection();
    const textArea = document.getElementById('rte-textarea');
    if (!textArea) return;
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const before = local.substring(0, start);
    const sel = local.substring(start, end);
    const after = local.substring(end);
    const next = `${before}${wrapStart}${sel || 'text'}${wrapEnd}${after}`;
    setLocal(next);
    onChange && onChange(next);
    // restore cursor
    requestAnimationFrame(()=>{ textArea.focus(); textArea.selectionStart = start + wrapStart.length; textArea.selectionEnd = start + wrapStart.length + (sel || 'text').length; });
  }, [local, onChange]);

  const insertLine = useCallback((line) => {
    const textArea = document.getElementById('rte-textarea');
    if (!textArea) return;
    const start = textArea.selectionStart;
    const before = local.substring(0, start);
    const after = local.substring(start);
    const prefix = before.endsWith('\n') || before.length === 0 ? '' : '\n';
    const next = `${before}${prefix}${line}\n${after}`;
    setLocal(next);
    onChange && onChange(next);
    requestAnimationFrame(()=>{ textArea.focus(); });
  }, [local, onChange]);

  return (
    <div className={cn('border rounded-md bg-background flex flex-col', className)}>
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/40">
        <Button type="button" size="sm" variant="outline" onClick={()=>apply('**')}>Bold</Button>
        <Button type="button" size="sm" variant="outline" onClick={()=>apply('__')}>Underline</Button>
        <Button type="button" size="sm" variant="outline" onClick={()=>insertLine('## Heading 2')}>H2</Button>
        <Button type="button" size="sm" variant="outline" onClick={()=>insertLine('### Heading 3')}>H3</Button>
        <Button type="button" size="sm" variant="outline" onClick={()=>insertLine('* List item')}>List</Button>
        <Button type="button" size="sm" variant="outline" onClick={()=>insertLine('> Quote')}>Quote</Button>
        <Button type="button" size="sm" variant="outline" onClick={()=>insertLine('```\ncode\n```')}>Code</Button>
      </div>
      <textarea
        id="rte-textarea"
        className="min-h-[260px] w-full resize-y bg-transparent px-3 py-2 text-sm focus:outline-none"
        value={local}
        placeholder={placeholder}
        onChange={(e)=>{ setLocal(e.target.value); onChange && onChange(e.target.value); }}
      />
      <div className="flex justify-end px-3 pb-1 text-[10px] text-muted-foreground">Markdown style shortcuts supported</div>
    </div>
  );
}

export default RichTextEditor;