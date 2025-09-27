import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Context, server } from "../main";
import ProtectedRoute from "../utils/ProtectedRoute";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import RichTextEditor from "../components/ui/rich-text-editor";
import { cn } from "../lib/utils";
import { OneCard } from "../components/CommunityCards";

const Community = () => {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated } = useContext(Context);
  const [posts, setPosts] = useState([]);
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [viewPost, setViewPost] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${server}/posts`, {
          withCredentials: true,
        });
        setPosts(res.data.posts);
        toast.success("Posts fetched successfully!");
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Error fetching posts");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreatePost = async () => {
    if (!user) {
      toast.error("User information is missing.");
      return;
    }

    setLoading(true);
    try {
      const resai = await axios.post(
        `https://ai-summarizer-eta-ashy.vercel.app/evaluate`,
        {
          text: `Summarize the following text in 3 sentences:\n\n${description}`,
        },
        {
          withCredentials: true,
        }
      );
      // console.log(resai.data);
      toast.success("Summary generated using AI successfully!");
      const res = await axios.post(
        `${server}/posts`,
        {
          heading,
          description,
          user: user?._id,
          summary: resai.data.summary,
        },
        {
          withCredentials: true,
        }
      );
      toast.success("Post created successfully!");
      
      setOpen(false);
      setPosts
      setPosts([...posts, res.data.post]);
      
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.message || "Error creating post");
    } finally {
      setLoading(false); 
    }
  };

  const handleViewPost = (id) => {
    setViewPost(id);
  };

  const resetViewPost = () => {
    setViewPost(null);
  };

  // Simple markdown help popover (inline)
  const [showHelp, setShowHelp] = useState(false);

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-2xl font-bold tracking-tight">Community Posts</h1>
          <Button onClick={()=>setOpen(true)} size="sm">New Post</Button>
        </div>

        {open && (
          <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-background/70 backdrop-blur p-2 sm:p-4">
            <div className="w-full max-w-2xl rounded-xl border bg-card shadow-lg overflow-hidden animate-in fade-in zoom-in-95">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold">Create New Post</h2>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={()=>setShowHelp(h=>!h)}>Rules</Button>
                  <Button variant="ghost" size="sm" onClick={()=>setOpen(false)}>✕</Button>
                </div>
              </div>
              {showHelp && (
                <div className="px-4 py-2 text-[11px] border-b grid gap-1 bg-muted/40">
                  <p className="font-medium mb-1">Formatting Shortcuts:</p>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-1 list-disc pl-4">
                    <li>## Heading 2</li>
                    <li>### Heading 3</li>
                    <li>**bold**</li>
                    <li>__underline__</li>
                    <li>* list item</li>
                    <li>{'>'} quote</li>
                    <li>``` code ```</li>
                  </ul>
                </div>
              )}
              <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
                <div className="space-y-1">
                  <label className="text-xs font-medium tracking-wide text-muted-foreground">Heading</label>
                  <Input value={heading} onChange={e=>setHeading(e.target.value)} placeholder="Enter a concise title" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium tracking-wide text-muted-foreground">Content</label>
                  <RichTextEditor value={description} onChange={setDescription} placeholder="Write something insightful..." />
                </div>
              </div>
              <div className="p-4 border-t flex justify-end gap-2 bg-muted/30">
                <Button variant="outline" onClick={()=>setOpen(false)} disabled={loading}>Cancel</Button>
                <Button onClick={handleCreatePost} disabled={loading || !heading || !description}>{loading? 'Posting...' : 'Post'}</Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-4 relative min-h-[200px]">
          {loading && !viewPost && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="text-xs text-muted-foreground">Loading posts...</p>
              </div>
            </div>
          )}
          {!loading && !viewPost && posts.length === 0 && (
            <div className="text-sm text-muted-foreground border rounded-lg p-8 text-center">No posts yet. Be the first to share!</div>
          )}
          {!loading && !viewPost && posts.length > 0 && (
            <div className="grid gap-4 opacity-100 transition">
              {posts.map(post => (
                <div key={post._id} className="rounded-lg border bg-card p-5 shadow-sm hover:shadow transition flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold leading-tight truncate">{post.heading}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.summary}</p>
                    <p className="text-[11px] mt-2 text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="outline" onClick={()=>handleViewPost(post._id)}>Read More</Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewPost && !loading && posts.map(post => post._id === viewPost ? (
            <div key={post._id} className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="mb-4 flex justify-between items-start gap-4 flex-wrap">
                <Button size="sm" variant="outline" onClick={resetViewPost}>Back</Button>
                <p className="text-[11px] text-muted-foreground">Created {new Date(post.createdAt).toLocaleString()}</p>
              </div>
              <h2 className="text-2xl font-bold mb-4 leading-tight break-words">{post.heading}</h2>
              <article className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                {post.description}
              </article>
            </div>
          ) : null)}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Community;
