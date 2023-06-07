import { useState, useEffect } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

function ScrollButton() {
  const [showScrollToBottomButton, setShowScrollToBottomButton] = useState(false);
  const [showScrollToTopButton, setShowScrollToTopButton] = useState(false);

  function handleScroll() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset;

    setShowScrollToBottomButton(scrollTop < documentHeight - windowHeight);
    setShowScrollToTopButton(scrollTop > windowHeight / 2 && scrollTop >= documentHeight - windowHeight);
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function scrollToBottom() {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {showScrollToBottomButton && !showScrollToTopButton && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-4 right-4 md:bottom-8 md:right-8 bg-blue-400 hover:bg-blue-600 text-white font-bold mb-16 py-2 px-4 rounded-full"
        >
          <FaArrowDown />
        </button>
      )}
      {!showScrollToBottomButton && showScrollToTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 md:bottom-8 md:right-8 bg-blue-400 hover:bg-blue-600 text-white font-bold mb-16 py-2 px-4 rounded-full"
        >
          <FaArrowUp />
        </button>
      )}
    </>
  );
}

export default ScrollButton;
