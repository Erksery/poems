import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import styles from "./index.module.scss";
import type { Collection, Poem } from "@/data/archive";

interface HeaderProps {
  collections?: Collection[];
  currentCollections?: Collection[];
  poems?: Poem[];
  currentPoem?: Poem;
  previousPoem?: Poem;
  nextPoem?: Poem;
}

const poemUrl = (slug: string) => `${import.meta.env.BASE_URL}/${slug}`;

export const Header = ({
  collections,
  currentCollections = [],
  poems = [],
  currentPoem,
  previousPoem,
  nextPoem,
}: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        modalRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return;
      }

      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={styles.header_container}>
      <header className={styles.header}>
        <div className={styles.poems_controller}>
          <a
            href={previousPoem ? poemUrl(previousPoem.slug) : undefined}
            className={clsx(styles.controll, !previousPoem && styles.disabled)}
            aria-label="Предыдущий стих"
            aria-disabled={!previousPoem}
            tabIndex={previousPoem ? 0 : -1}
          >
            <ChevronLeft />
          </a>

          <button
            ref={triggerRef}
            type="button"
            className={clsx(
              styles.poem_active,
              isOpen && styles.poem_active_open,
            )}
            onClick={() => setIsOpen((value) => !value)}
            aria-expanded={isOpen}
          >
            {currentPoem?.title ?? "Нажмите для выбора"}

            <div className={styles.collections}>
              {currentPoem &&
                currentCollections.map((collection) => (
                  <p key={collection.name}>{collection.name}</p>
                ))}
            </div>
          </button>

          <a
            href={nextPoem ? poemUrl(nextPoem.slug) : undefined}
            className={clsx(styles.controll, !nextPoem && styles.disabled)}
            aria-label="Следующий стих"
            aria-disabled={!nextPoem}
            tabIndex={nextPoem ? 0 : -1}
          >
            <ChevronRight />
          </a>
        </div>
      </header>

      <div
        className={clsx(styles.poem_modal, isOpen && styles.poem_modal_open)}
        onClick={() => setIsOpen(false)}
      >
        <div
          ref={modalRef}
          className={styles.poem_modal_content}
          onClick={(event) => event.stopPropagation()}
        >
          {collections?.map((collectionItem) => {
            const collectionPoems =
              collectionItem.id === "all"
                ? poems
                : poems.filter((poem) =>
                    poem.collections.includes(collectionItem.id),
                  );

            return (
              <section
                key={collectionItem.id}
                className={styles.poem_collection}
              >
                <p>Категория</p>
                <h3>{collectionItem.name}</h3>

                <div className={styles.poem_list}>
                  <hr className={styles.tab} />

                  <div className={styles.list}>
                    {collectionPoems.map((poem) => (
                      <a
                        key={poem.id}
                        href={poemUrl(poem.slug)}
                        className={clsx(
                          styles.poem_item,
                          poem.slug === currentPoem?.slug &&
                            styles.poem_item_active,
                        )}
                      >
                        {poem.title}
                      </a>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};
