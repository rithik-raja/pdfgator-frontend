const updateUser = () => {
    const event = new CustomEvent('userUpdate', null)
    document.dispatchEvent(event)
}
export default updateUser