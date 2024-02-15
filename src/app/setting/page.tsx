export default function Setting() {
  return (
    <>
      <form action="/auth/signout" method="post">
        <button className="button block" type="submit">
          ログアウト
        </button>
      </form>
    </>
  );
}
