function create_chat(user_id) {
    fetch(`/app/messages/${user_id}/create`)
    .then(response => response.json())
    .catch(error => {
        console.error('Error creating chat:', error);
    });
}