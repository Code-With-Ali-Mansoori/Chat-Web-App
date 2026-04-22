
export const shortenId = (id : string ) => {
      if (!id) return "";
      return id.length > 15 ? id.slice(0, 20) + "..." : id;
   };

export const copyUserId = async (userId : string) => {
    try {
        await navigator.clipboard.writeText(userId);

    } catch (err) {
        console.error("Failed to copy", err);
}};
