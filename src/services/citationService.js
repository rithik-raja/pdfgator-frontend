export const generateCiteJSON = (pdfList, idx, page=1) => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    console.log(pdfList[idx])
    return !pdfList[idx].isbn ? {
        type: pdfList[idx].doc_type,
        title: pdfList[idx].title,
        author: JSON.parse(pdfList[idx].author_names),
        publisher: pdfList[idx].publisher,
        issued: {
          "date-parts": [[pdfList[idx].publication_year]],
        },
        accessed: {
          "date-parts": [[yyyy, mm, dd]],
        },
        "container-title": pdfList[idx].container_title, // journal name for article
        URL: pdfList[idx].url
    } : pdfList[idx].isbn
}