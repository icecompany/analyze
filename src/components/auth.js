import React from "react";

export default class Auth extends React.Component {
    render() {
        return (
            <div className="alert alert-warning m-2">
                Необходима авторизация в системе. Нажмите <a href="/administrator/index.php?option=com_contracts&amp;view=contracts" target="_blank">здесь</a> для входа в систему и после этого перезагрузите эту страницу.
            </div>
        )
    }
}
