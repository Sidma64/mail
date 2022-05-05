function EmailView(props) {
    return (
    <a href="emails/{props.id}">
        <div>
          <a>{props.sender}</a><a>{props.title}</a>
        </div>
    </a>
  );
}