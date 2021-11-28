// @ts-check

module.exports = {
  translation: {
    appName: 'Fastify Шаблон',
    flash: {
      session: {
        create: {
          success: 'Вы залогинены',
          error: 'Неправильный емейл или пароль',
        },
        delete: {
          success: 'Вы разлогинены',
        },
      },
      users: {
        create: {
          error: 'Не удалось зарегистрировать',
          success: 'Пользователь успешно зарегистрирован',
        },
        update: {
          success: 'Пользователь успешно изменен',
          error: 'Не удалось изменить пользователя',
        },
        delete: {
          success: 'Пользователь успешно удален',
          error: 'Не удалось изменить удалить',
        },
      },
      authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
      task: {
        create: {
          success: 'Задача успешно создана',
          error: 'Не удалось создать задачу',
        },
        update: {
          success: 'Задача успешно обновлена',
          error: 'Не удалось обновить задачу',
        },
        delete: {
          success: 'Задача успешно удалена',
        },
        showError: 'Нет задачи с такими параметрами',
        authError: 'Задачу может удалить только её автор',
      },
      labels: {
        create: {
          success: 'Метка успешно создана',
          error: 'Не удалось создать метку',
        },
        delete: {
          success: 'Метка успешно удалена',
          error: 'Не удалось удалить метку',
        },
        update: {
          success: 'Метка успешно изменена',
          error: 'Не удалось изменить метку',
        },
      },
      status: {
        create: {
          success: 'Статус успешно создан',
          error: 'Не удалось создать статус',
        },
        update: {
          error: 'Не удалось изменить статус',
          success: 'Статус успешно изменён',
        },
        delete: {
          error: 'Не удалось удалить статус',
          success: 'Статус успешно удалён',
        },
      },
    },
    layouts: {
      application: {
        users: 'Пользователи',
        statuses: 'Статусы',
        tasks: 'Задачи',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выход',
        labels: 'Метки',

      },
    },
    views: {
      labels: {
        id: 'ID',
        name: 'Наименование',
        createdAt: 'Дата создания',
        titleUpdate: 'Изменение метки',
        new: {
          create: 'Создать метку',
          title: 'Создание метки',
        },
      },
      manage: {
        edit: 'Изменить',
        delete: 'Удалить',
        submit: 'Создать',
      },
      session: {
        new: {
          signIn: 'Вход',
          submit: 'Войти',
        },
      },
      users: {
        id: 'ID',
        email: 'Email',
        createdAt: 'Дата создания',
        new: {
          submit: 'Сохранить',
          signUp: 'Регистрация',
        },
      },
      statuses: {
        id: 'ID',
        name: 'Наименование',
        createdAt: 'Дата создания',
        titleUpdate: 'Изменение статуса',
        new: {
          create: 'Создать статус',
          title: 'Создание статуса',
          submit: 'Создать',
        },
      },
      welcome: {
        index: {
          hello: 'Привет от Хекслета!',
          description: 'Практические курсы по программированию',
          more: 'Узнать Больше',
        },
      },
      actions: {
        edit: 'Изменить',
        delete: 'Удалить',
        submit: 'Создать',
      },
      tasks: {
        create: 'Создать задачу',
        createTitle: 'Создание задачи',
        editTitle: 'Изменение задачи',
        id: 'ID',
        name: 'Наименование',
        status: 'Статус',
        author: 'Автор',
        executor: 'Исполнитель',
        labels: 'Метки',
        createdAt: 'Дата создания',
        filter: 'Показать',
      },
      filters: {
        status: 'Статус',
        executor: 'Исполнитель',
        label: 'Метка',
        isCreatorUser: 'Только мои задачи',
      },
    },
    form: {
      firstName: 'Имя',
      lastName: 'Фамилия',
      email: 'Email',
      password: 'Пароль',
      name: 'Наименование',
      description: 'Описание',
      status: 'Статус',
    },
  },
};
