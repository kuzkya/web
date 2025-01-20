export default function Header() {
    return (
        <header className="header-block">
            <div className="header-block-left-part">
                <h1>Порт</h1>
                <img src="/images/favicon.png" alt="Logo" />
            </div>
            <div className="header-block-right-part">
                <img
                    src="/images/Avatar.jpg"
                    className="header-block-right-part-avatar"
                    alt="header-block-right-part-avatar"
                />
                <span className="header-block-right-part-name">
                    Администратор порта
                </span>
            </div>
        </header>
    );
}
