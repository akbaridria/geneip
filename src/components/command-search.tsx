"use client";
import { useCallback, useEffect, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { useDebounceValue } from "usehooks-ts";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useSearchIpAsset } from "@/api/query";
import type { IpAsset as IpAssetType, Metadata } from "@/types";
import { ImageWithFallback } from "./image-with-fallback";
import { useIpGraphStore } from "@/store";

export function CommandSearch() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<IpAssetType[]>([]);
  const [debounceValue] = useDebounceValue(searchQuery, 500);

  const {
    mutate: searchAssets,
    isPending: isLoading,
    isError,
    error,
  } = useSearchIpAsset();

  useEffect(() => {
    if (debounceValue.trim()) {
      searchAssets(debounceValue, {
        onSuccess: (data) => {
          setSearchResults(data || []);
        },
        onError: () => {
          setSearchResults([]);
        },
      });
    } else {
      setSearchResults([]);
    }
  }, [debounceValue, searchAssets]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }

      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const { setSelectedAssetId, setLoading } = useIpGraphStore();

  const handleSelectAsset = (asset: IpAssetType) => {
    setLoading(true);
    setSelectedAssetId(asset.asset_id);
    setOpen(false);
    setSearchQuery("");
    setLoading(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const getContractName = useCallback((metadata: Metadata) => {
    if (!metadata?.name) return "N/A";
    const name = metadata.name;
    const match = name.match(/^\d+:\s*([^#]+)\s*#\d+$/);
    return match ? match[1].trim() : name;
  }, []);

  const getName = useCallback((metadata: Metadata) => {
    if (metadata?.title) {
      return metadata?.title + " #" + metadata.tokenId;
    }
    if (metadata?.name) {
      return metadata?.name;
    }
    return "N/A";
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="absolute inset-0 top-4 left-1/2 -translate-x-1/2 inline-flex items-center justify-between w-full max-w-[400px] px-3 py-2 text-sm border rounded-md shadow-sm bg-sidebar border-input hover:bg-accent hover:text-accent-foreground z-5 transition-colors h-fit"
        aria-label="Open search dialog"
      >
        <div className="inline-flex items-center gap-2">
          <Search className="h-4 w-4" />
          <span className="text-muted-foreground">Search IP Assets...</span>
        </div>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <CommandInput
          className="flex-1"
          placeholder="Search IP Assets by ID, name, or description..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          {isLoading && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-muted-foreground">
                Searching...
              </span>
            </div>
          )}

          {isError && (
            <div className="flex items-center justify-center py-6">
              <span className="text-sm text-destructive">
                {error instanceof Error
                  ? error.message
                  : "Failed to search assets"}
              </span>
            </div>
          )}

          {!isLoading &&
            !isError &&
            searchQuery &&
            searchResults.length === 0 && (
              <CommandEmpty>No assets found for "{searchQuery}"</CommandEmpty>
            )}

          {!isLoading && !isError && searchResults.length > 0 && (
            <CommandGroup heading={`IP Assets (${searchResults.length})`}>
              {searchResults.map((asset) => (
                <CommandItem
                  key={asset.id}
                  onSelect={() => handleSelectAsset(asset)}
                  className="flex items-center gap-3 py-3 cursor-pointer"
                  value={`${asset.asset_id} ${asset.metadata?.name || ""} ${
                    asset.metadata?.description || ""
                  } ${asset.metadata?.title || ""}`}
                >
                  <div className="flex-shrink-0">
                    <ImageWithFallback
                      src={asset.metadata?.imageUrl || "/placeholder.svg"}
                      alt=""
                      width={48}
                      height={48}
                      fallbackSrc="https://placehold.co/48x48?text=No+Image"
                      className="border rounded-lg"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm truncate">
                        {getContractName(asset.metadata)}
                      </h4>
                    </div>

                    <p className="text-xs text-muted-foreground truncate">
                      ID: {asset.asset_id}
                    </p>

                    {asset.metadata?.name && (
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {getName(asset.metadata)}
                      </p>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          <CommandSeparator />
          <div className="px-2 py-3 mt-auto sticky bottom-0 bg-popover text-xs text-center text-muted-foreground">
            Press{" "}
            <kbd className="px-1 py-0.5 rounded border bg-muted font-mono">
              ↑
            </kbd>{" "}
            <kbd className="px-1 py-0.5 rounded border bg-muted font-mono">
              ↓
            </kbd>{" "}
            to navigate,{" "}
            <kbd className="px-1 py-0.5 rounded border bg-muted font-mono">
              Enter
            </kbd>{" "}
            to select,{" "}
            <kbd className="px-1 py-0.5 rounded border bg-muted font-mono">
              Esc
            </kbd>{" "}
            to close
          </div>
        </CommandList>
      </CommandDialog>
    </>
  );
}
