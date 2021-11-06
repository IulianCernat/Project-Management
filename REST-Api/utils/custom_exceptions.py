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
