class AuthorizationFailed(Exception):
    def __init__(self, reason):
        self.message = f"Authorization failed: {reason}"
        super().__init__(self.message)


class TrelloRequestFailure(Exception):
    def __init__(self, reason):
        self.message = f"Trello request failed: {reason}"
        super().__init__(self.message)


class TrelloResourceUnavailable(Exception):
    def __init__(self, reason):
        self.message = f"Trello resource unavailable: {reason}"
        super().__init__(self.message)


class AuthFileCouldNotBeFound(Exception):
    def __init__(self):
        super().__init__("Auth file for email service could not be found")


class FirebaseException(Exception):
    def __init__(self, reason):
        self.message = f"Firebase error: {reason}"
        super().__init__(self.message)
