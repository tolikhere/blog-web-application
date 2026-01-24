const tx = document.getElementById('content');
if (tx) {
  setTimeout(() => {
    tx.style.height = (tx.scrollHeight) + "px";
  }, 0);

  tx.addEventListener("input", function() {
    // Reset height to 'auto' first so it can shrink if text is deleted
    this.style.height = "auto";
    
    // Set height to the scrollHeight (the actual content height)
    this.style.height = (this.scrollHeight) + "px";
  });
}
