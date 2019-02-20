const renderList = list => {
  return (list.length === 0 ? "_(none)_" : list.slice(0, 5).join(", ") + (list.length > 5 ? `_, and ${list.length - 5} more..._` : ""))
}

module.exports = function(commit) {
  return {
    fallback: `${commit.id.substr(0, 7)} by ${commit.author.username}: ${commit.message}`,
    author_name: commit.author.name,
    author_link: `https://github.com/${commit.author.username}`,
    title: `Commit ${commit.id}`,
    title_link: commit.url,
    text: commit.message,
    fields: [
      {
        title: "Added Files",
        value: renderList(commit.added),
        short: true
      },
      {
        title: "Removed Files",
        value: renderList(commit.removed),
        short: true
      },
      {
        title: "Modified Files",
        value: renderList(commit.modified),
        short: true
      }
    ]
  }
}