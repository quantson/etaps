function handleDragStart(e) {
  this.style.opacity = '0.4';  // this / e.target is the source node.
}

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
});